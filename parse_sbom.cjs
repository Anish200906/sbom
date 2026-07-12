const fs = require('fs');
const path = require('path');

// Read input and output file paths from CLI args, or fallback to defaults
const inputPath = process.argv[2] || 'sbom.json';
const outputPath = process.argv[3] || 'sbom_dependencies.csv';

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file "${inputPath}" not found.`);
  console.log(`Usage: node parse_sbom.cjs [input_json_file] [output_csv_file]`);
  process.exit(1);
}

try {
  console.log(`Reading and parsing "${inputPath}"...`);
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const sbom = JSON.parse(rawData);

  let components = [];
  
  // Helper to resolve Package URL ecosystem
  function getPurl(name, version) {
    let type = 'generic';
    const n = name.toLowerCase();
    if (n === 'eslint' || n === 'react' || n === 'lodash') {
      type = 'npm';
    } else if (n.startsWith('go-') || n.includes('golang')) {
      type = 'golang';
    } else if (
      n.includes('core') || 
      n.includes('api') || 
      n.includes('netty') || 
      n.includes('disruptor') || 
      n.includes('jackson') || 
      n.includes('hibernate') || 
      n.includes('http') || 
      n.includes('logback') || 
      n.includes('yaml') || 
      n.includes('lombok') || 
      n.includes('assertj') ||
      n.includes('xml')
    ) {
      type = 'maven';
    }
    return `pkg:${type}/${name}@${version}`;
  }

  // 0. Transitive dependencies schema mapping
  if (Array.isArray(sbom) && sbom.length > 0 && (sbom[0].parent_library || sbom[0].child_library)) {
    const uniqueMap = new Map();
    sbom.forEach(item => {
      const appId = item.application_id || 'UnknownApp';
      
      // Process parent (Direct dependency)
      if (item.parent_library) {
        const name = item.parent_library;
        const ver = item.parent_version || '0.0.0';
        const purl = getPurl(name, ver);
        const key = `${appId}:${name}:${ver}`;
        uniqueMap.set(key, {
          name: name,
          version: ver,
          type: 'Direct',
          application: appId,
          purl: purl,
          license: 'Unknown'
        });
      }

      // Process child (Transitive dependency of parent)
      if (item.child_library) {
        const name = item.child_library;
        const ver = item.child_version || '0.0.0';
        const purl = getPurl(name, ver);
        const key = `${appId}:${name}:${ver}`;
        uniqueMap.set(key, {
          name: name,
          version: ver,
          type: 'Transitive',
          application: appId,
          purl: purl,
          license: 'Unknown'
        });
      }
    });
    components = Array.from(uniqueMap.values());
  }
  // 1. Direct Array format
  else if (Array.isArray(sbom)) {
    components = sbom;
  }
  // 2. Extract components based on CycloneDX format
  else if (sbom.components && Array.isArray(sbom.components)) {
    components = sbom.components;
  } 
  // 3. Fallback: SPDX JSON format check
  else if (sbom.packages && Array.isArray(sbom.packages)) {
    components = sbom.packages.map(p => ({
      name: p.name || p.SPDXID,
      version: p.versionInfo || '',
      licenses: p.licenseDeclared ? [{ license: { name: p.licenseDeclared } }] : [],
      purl: p.externalRefs && p.externalRefs[0] ? p.externalRefs[0].referenceLocator : ''
    }));
  }
  // 4. npm package-lock v2/v3 packages object format
  else if (sbom.packages && typeof sbom.packages === 'object') {
    components = Object.entries(sbom.packages)
      .filter(([key]) => key !== '')
      .map(([key, p]) => {
        const name = key.replace(/^node_modules\//, '');
        return {
          name: name,
          version: p.version || '',
          license: p.license || 'Unknown',
          purl: `pkg:npm/${name}@${p.version || ''}`
        };
      });
  }
  // 5. General dependency map (package.json or yarn/npm v1 dependencies)
  else if (sbom.dependencies && typeof sbom.dependencies === 'object') {
    components = Object.entries(sbom.dependencies).map(([name, depVal]) => {
      const version = typeof depVal === 'string' ? depVal : (depVal.version || '');
      const cleanVer = version.replace(/^[\^~]/, '');
      return {
        name: name,
        version: version,
        license: typeof depVal === 'object' && depVal.license ? depVal.license : 'Unknown',
        purl: `pkg:npm/${name}@${cleanVer}`
      };
    });
  }

  if (components.length === 0) {
    console.error('Error: No packages/components found in the SBOM file.');
    process.exit(1);
  }

  console.log(`Found ${components.length} components. Processing...`);

  // CSV column headers
  const csvHeaders = ['Application', 'Name', 'Version', 'License', 'DependencyType', 'Purl'];
  const csvRows = [csvHeaders.join(',')];
  const tableData = [];

  components.forEach(comp => {
    // Extract license information
    let license = 'Unknown';
    if (comp.licenses && Array.isArray(comp.licenses) && comp.licenses.length > 0) {
      const licObj = comp.licenses[0];
      if (licObj.license) {
        license = licObj.license.id || licObj.license.name || 'Unknown';
      } else if (licObj.expression) {
        license = licObj.expression;
      }
    } else if (comp.license) {
      license = comp.license;
    }

    const type = comp.type || 'library';
    const purl = comp.purl || '';
    const application = comp.application || 'N/A';

    // Stage for CSV
    csvRows.push([
      cleanCSVValue(application),
      cleanCSVValue(comp.name || ''),
      cleanCSVValue(comp.version || ''),
      cleanCSVValue(license),
      cleanCSVValue(type),
      cleanCSVValue(purl)
    ].join(','));

    // Stage for console output
    tableData.push({
      Application: application,
      Name: comp.name || 'unknown',
      Version: comp.version || '',
      License: license,
      Type: type,
      Purl: purl
    });
  });

  // Output table to console terminal
  console.log('\n======================================= PARSED DEPENDENCIES =======================================');
  console.table(tableData);
  console.log('===================================================================================================\n');

  // Write the formatted CSV file
  fs.writeFileSync(outputPath, csvRows.join('\n'), 'utf8');
  console.log(`Success! Parsed ${components.length} components.`);
  console.log(`Saved output to "${outputPath}".`);

} catch (err) {
  console.error('Failed to parse SBOM file:', err.message);
  process.exit(1);
}

/**
 * Escapes values containing commas, quotes, or newlines for valid CSV cell formatting.
 */
function cleanCSVValue(value) {
  if (value === null || value === undefined) return '';
  let str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}
