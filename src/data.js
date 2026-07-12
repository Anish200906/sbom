export const projectsData = [
  {
    id: 'identity-provider',
    name: 'Identity Provider',
    description: 'OAuth2 & JWT authentication server',
    avatarLetter: 'IP',
    avatarBg: '#e0e4ff',
    avatarColor: '#a8b2fc',
    date: 'Jun 24, 2026',
    vulnerabilitiesText: '0 High, 2 Med',
    status: 'In Progress',
    statusClass: 'in-progress',
    complianceScore: 92,
    totalDependencies: 124,
    licenseAlerts: 1,
    
    // Severity breakdown for charts (max height at 100%)
    severityBreakdown: [
      { label: 'Critical', val: '0', height: '0%', class: 'bar-linux' },
      { label: 'High', val: '0', height: '0%', class: 'bar-mac' },
      { label: 'Medium', val: '2', height: '40%', class: 'bar-ios' },
      { label: 'Low', val: '10', height: '100%', class: 'bar-windows' },
    ],

    // License breakdown
    licenseBreakdown: [
      { name: 'MIT License', percentage: '64.5%', dotClass: 'dot-us' },
      { name: 'Apache 2.0', percentage: '24.2%', dotClass: 'dot-ca' },
      { name: 'GPL 3.0 (Warning)', percentage: '8.1%', dotClass: 'dot-mx' },
      { name: 'BSD 3-Clause', percentage: '3.2%', dotClass: 'dot-ot' },
    ],

    // Dependency Allocation breakdown (using Direct vs Transitive)
    dependencyBreakdown: [
      { label: 'Direct', val: '24', height: '60%', class: 'bar-mac' },
      { label: 'Transitive', val: '100', height: '100%', class: 'bar-windows' },
      { label: 'DevDeps', val: '45', height: '80%', class: 'bar-ios' },
      { label: 'Bundled', val: '0', height: '0%', class: 'bar-android' },
      { label: 'Optional', val: '4', height: '20%', class: 'bar-other' },
      { label: 'Peer', val: '8', height: '35%', class: 'bar-linux' }
    ],

    // Vulnerability Trend over the last 6 months (mock data for lines)
    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [15, 14, 18, 12, 11, 12],
      pathPoints: "M 50,110 C 100,110 100,115 150,115 C 200,115 200,95 250,95 C 300,95 300,130 350,130 C 400,130 400,140 450,140 C 500,140 500,130 550,130",
      fillPoints: "M 50,110 C 100,110 100,115 150,115 C 200,115 200,95 250,95 C 300,95 300,130 350,130 C 400,130 400,140 450,140 C 500,140 500,130 550,130 L 550,160 L 50,160 Z",
      coordinates: [
        { cx: 50, cy: 110, val: 15 },
        { cx: 150, cy: 115, val: 14 },
        { cx: 250, cy: 95, val: 18 },
        { cx: 350, cy: 130, val: 12 },
        { cx: 450, cy: 140, val: 11 },
        { cx: 550, cy: 130, val: 12 }
      ]
    },

    // Vulnerabilities List
    vulnerabilities: [
      {
        name: 'CVE-2026-1042 (jsonwebtoken)',
        severity: 'Medium',
        description: 'Key validation verification bypass under key confusion algorithms',
        date: 'Jun 24, 2026',
        cve: 'CVE-2026-1042',
        status: 'In Progress',
        statusClass: 'in-progress'
      },
      {
        name: 'CVE-2026-9812 (oauth2-server)',
        severity: 'Medium',
        description: 'Open redirect vulnerability in authorization endpoint request validation',
        date: 'May 12, 2026',
        cve: 'CVE-2026-9812',
        status: 'Pending',
        statusClass: 'pending'
      }
    ],

    // Dependencies List
    dependencies: [
      {
        name: 'react',
        description: 'Frontend component UI library framework',
        avatarLetter: 'RE',
        avatarBg: '#e0e4ff',
        avatarColor: '#a8b2fc',
        version: 'v18.3.1',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      },
      {
        name: 'jsonwebtoken',
        description: 'JWT token signing and decoding validation',
        avatarLetter: 'JW',
        avatarBg: '#fff5e6',
        avatarColor: '#d97d24',
        version: 'v9.0.2',
        license: 'Apache 2.0',
        status: 'Pending',
        statusClass: 'pending'
      },
      {
        name: 'oauth2-server',
        description: 'OAuth2 framework server spec implementation',
        avatarLetter: 'OA',
        avatarBg: '#dbfaf6',
        avatarColor: '#80e2d6',
        version: 'v3.1.2',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      },
      {
        name: 'express',
        description: 'HTTP router REST web framework',
        avatarLetter: 'EX',
        avatarBg: '#e0f3ff',
        avatarColor: '#80b3ff',
        version: 'v4.19.2',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      }
    ]
  },
  {
    id: 'web-application-client',
    name: 'Web Application Client',
    description: 'Primary customer-facing React dashboard',
    avatarLetter: 'WA',
    avatarBg: '#dbfaf6',
    avatarColor: '#80e2d6',
    date: 'Mar 10, 2026',
    vulnerabilitiesText: 'None',
    status: 'Complete',
    statusClass: 'complete',
    complianceScore: 100,
    totalDependencies: 412,
    licenseAlerts: 0,
    
    severityBreakdown: [
      { label: 'Critical', val: '0', height: '0%', class: 'bar-linux' },
      { label: 'High', val: '0', height: '0%', class: 'bar-mac' },
      { label: 'Medium', val: '0', height: '0%', class: 'bar-ios' },
      { label: 'Low', val: '0', height: '0%', class: 'bar-windows' },
    ],

    licenseBreakdown: [
      { name: 'MIT License', percentage: '77.7%', dotClass: 'dot-us' },
      { name: 'Apache 2.0', percentage: '17.0%', dotClass: 'dot-ca' },
      { name: 'BSD 3-Clause', percentage: '5.3%', dotClass: 'dot-ot' },
    ],

    dependencyBreakdown: [
      { label: 'Direct', val: '45', height: '50%', class: 'bar-mac' },
      { label: 'Transitive', val: '367', height: '100%', class: 'bar-windows' },
      { label: 'DevDeps', val: '120', height: '90%', class: 'bar-ios' },
      { label: 'Bundled', val: '0', height: '0%', class: 'bar-android' },
      { label: 'Optional', val: '0', height: '0%', class: 'bar-other' },
      { label: 'Peer', val: '12', height: '25%', class: 'bar-linux' }
    ],

    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [2, 1, 0, 0, 0, 0],
      pathPoints: "M 50,150 C 100,150 100,155 150,155 C 200,155 200,160 250,160 C 300,160 300,160 350,160 C 400,160 400,160 450,160 C 500,160 500,160 550,160",
      fillPoints: "M 50,150 C 100,150 100,155 150,155 C 200,155 200,160 250,160 C 300,160 300,160 350,160 C 400,160 400,160 450,160 C 500,160 500,160 550,160 L 550,160 L 50,160 Z",
      coordinates: [
        { cx: 50, cy: 150, val: 2 },
        { cx: 150, cy: 155, val: 1 },
        { cx: 250, cy: 160, val: 0 },
        { cx: 350, cy: 160, val: 0 },
        { cx: 450, cy: 160, val: 0 },
        { cx: 550, cy: 160, val: 0 }
      ]
    },

    vulnerabilities: [],

    dependencies: [
      {
        name: 'react',
        description: 'Frontend component UI library framework',
        avatarLetter: 'RE',
        avatarBg: '#e0e4ff',
        avatarColor: '#a8b2fc',
        version: 'v18.3.1',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      },
      {
        name: 'lodash',
        description: 'General purpose utility library',
        avatarLetter: 'LO',
        avatarBg: '#dbfaf6',
        avatarColor: '#80e2d6',
        version: 'v4.17.21',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      }
    ]
  },
  {
    id: 'search-sync-api',
    name: 'Search & Sync API',
    description: 'Algolia index updating scheduler',
    avatarLetter: 'SS',
    avatarBg: '#e0f3ff',
    avatarColor: '#80b3ff',
    date: 'Nov 10, 2026',
    vulnerabilitiesText: '1 High, 3 Med',
    status: 'Pending',
    statusClass: 'pending',
    complianceScore: 78,
    totalDependencies: 87,
    licenseAlerts: 2,
    
    severityBreakdown: [
      { label: 'Critical', val: '0', height: '0%', class: 'bar-linux' },
      { label: 'High', val: '1', height: '40%', class: 'bar-mac' },
      { label: 'Medium', val: '3', height: '100%', class: 'bar-ios' },
      { label: 'Low', val: '0', height: '0%', class: 'bar-windows' },
    ],

    licenseBreakdown: [
      { name: 'MIT License', percentage: '51.7%', dotClass: 'dot-us' },
      { name: 'Apache 2.0', percentage: '34.5%', dotClass: 'dot-ca' },
      { name: 'GPL 3.0 (Warning)', percentage: '11.5%', dotClass: 'dot-mx' },
      { name: 'BSD 2-Clause', percentage: '2.3%', dotClass: 'dot-ot' },
    ],

    dependencyBreakdown: [
      { label: 'Direct', val: '15', height: '40%', class: 'bar-mac' },
      { label: 'Transitive', val: '72', height: '100%', class: 'bar-windows' },
      { label: 'DevDeps', val: '28', height: '70%', class: 'bar-ios' },
      { label: 'Bundled', val: '0', height: '0%', class: 'bar-android' },
      { label: 'Optional', val: '1', height: '10%', class: 'bar-other' },
      { label: 'Peer', val: '2', height: '15%', class: 'bar-linux' }
    ],

    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [1, 2, 2, 3, 4, 4],
      pathPoints: "M 50,150 C 100,150 100,140 150,140 C 200,140 200,140 250,140 C 300,140 300,130 350,130 C 400,130 400,120 450,120 C 500,120 500,120 550,120",
      fillPoints: "M 50,150 C 100,150 100,140 150,140 C 200,140 200,140 250,140 C 300,140 300,130 350,130 C 400,130 400,120 450,120 C 500,120 500,120 550,120 L 550,160 L 50,160 Z",
      coordinates: [
        { cx: 50, cy: 150, val: 1 },
        { cx: 150, cy: 140, val: 2 },
        { cx: 250, cy: 140, val: 2 },
        { cx: 350, cy: 130, val: 3 },
        { cx: 450, cy: 120, val: 4 },
        { cx: 550, cy: 120, val: 4 }
      ]
    },

    vulnerabilities: [
      {
        name: 'CVE-2026-4552 (algoliasearch)',
        severity: 'High',
        description: 'Server-Side Request Forgery (SSRF) in API client indexing fallback triggers',
        date: 'Nov 10, 2026',
        cve: 'CVE-2026-4552',
        status: 'Pending',
        statusClass: 'pending'
      },
      {
        name: 'CVE-2026-2180 (axios)',
        severity: 'Medium',
        description: 'Prototype pollution vulnerability in default custom request merges',
        date: 'Oct 04, 2026',
        cve: 'CVE-2026-2180',
        status: 'In Progress',
        statusClass: 'in-progress'
      },
      {
        name: 'CVE-2026-7721 (qs)',
        severity: 'Medium',
        description: 'Denial of service (DoS) in recursive query parser nesting filters',
        date: 'Jul 15, 2026',
        cve: 'CVE-2026-7721',
        status: 'In Progress',
        statusClass: 'in-progress'
      }
    ],

    dependencies: [
      {
        name: 'algoliasearch',
        description: 'Algolia index querying and syncer client SDK',
        avatarLetter: 'AL',
        avatarBg: '#e0f3ff',
        avatarColor: '#80b3ff',
        version: 'v4.20.0',
        license: 'MIT',
        status: 'Pending',
        statusClass: 'pending'
      },
      {
        name: 'axios',
        description: 'HTTP client promise request handler wrapper',
        avatarLetter: 'AX',
        avatarBg: '#dbfaf6',
        avatarColor: '#80e2d6',
        version: 'v1.6.2',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      },
      {
        name: 'qs',
        description: 'Query string parser nested parser utility',
        avatarLetter: 'QS',
        avatarBg: '#fff5e6',
        avatarColor: '#d97d24',
        version: 'v6.11.2',
        license: 'BSD 3-Clause',
        status: 'Approved',
        statusClass: 'approved'
      }
    ]
  },
  {
    id: 'notification-router',
    name: 'Notification Router',
    description: 'SMS and transaction mailer queue',
    avatarLetter: 'NR',
    avatarBg: '#fff5e6',
    avatarColor: '#d97d24',
    date: 'Dec 20, 2026',
    vulnerabilitiesText: 'None',
    status: 'Approved',
    statusClass: 'approved',
    complianceScore: 100,
    totalDependencies: 64,
    licenseAlerts: 0,
    
    severityBreakdown: [
      { label: 'Critical', val: '0', height: '0%', class: 'bar-linux' },
      { label: 'High', val: '0', height: '0%', class: 'bar-mac' },
      { label: 'Medium', val: '0', height: '0%', class: 'bar-ios' },
      { label: 'Low', val: '0', height: '0%', class: 'bar-windows' },
    ],

    licenseBreakdown: [
      { name: 'MIT License', percentage: '62.5%', dotClass: 'dot-us' },
      { name: 'Apache 2.0', percentage: '31.3%', dotClass: 'dot-ca' },
      { name: 'BSD 3-Clause', percentage: '6.2%', dotClass: 'dot-ot' },
    ],

    dependencyBreakdown: [
      { label: 'Direct', val: '12', height: '40%', class: 'bar-mac' },
      { label: 'Transitive', val: '52', height: '100%', class: 'bar-windows' },
      { label: 'DevDeps', val: '14', height: '60%', class: 'bar-ios' },
      { label: 'Bundled', val: '0', height: '0%', class: 'bar-android' },
      { label: 'Optional', val: '0', height: '0%', class: 'bar-other' },
      { label: 'Peer', val: '0', height: '0%', class: 'bar-linux' }
    ],

    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [0, 0, 0, 0, 0, 0],
      pathPoints: "M 50,160 C 100,160 100,160 150,160 C 200,160 200,160 250,160 C 300,160 300,160 350,160 C 400,160 400,160 450,160 C 500,160 500,160 550,160",
      fillPoints: "M 50,160 C 100,160 100,160 150,160 C 200,160 200,160 250,160 C 300,160 300,160 350,160 C 400,160 400,160 450,160 C 500,160 500,160 550,160 L 550,160 L 50,160 Z",
      coordinates: [
        { cx: 50, cy: 160, val: 0 },
        { cx: 150, cy: 160, val: 0 },
        { cx: 250, cy: 160, val: 0 },
        { cx: 350, cy: 160, val: 0 },
        { cx: 450, cy: 160, val: 0 },
        { cx: 550, cy: 160, val: 0 }
      ]
    },

    vulnerabilities: [],

    dependencies: [
      {
        name: 'nodemailer',
        description: 'Node mailing SMTP connector client',
        avatarLetter: 'NM',
        avatarBg: '#fff5e6',
        avatarColor: '#d97d24',
        version: 'v6.9.7',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      },
      {
        name: 'redis',
        description: 'Redis cache task broker database client',
        avatarLetter: 'RD',
        avatarBg: '#f3f3f3',
        avatarColor: '#707070',
        version: 'v4.6.10',
        license: 'MIT',
        status: 'Approved',
        statusClass: 'approved'
      }
    ]
  },
  {
    id: 'bigdata-pipeline-sdk',
    name: 'BigData Pipeline SDK',
    description: 'Kafka metrics ingestion worker',
    avatarLetter: 'BP',
    avatarBg: '#f3f3f3',
    avatarColor: '#707070',
    date: 'Jul 25, 2026',
    vulnerabilitiesText: '3 High, 8 Med',
    status: 'Rejected',
    statusClass: 'rejected',
    complianceScore: 64,
    totalDependencies: 512,
    licenseAlerts: 5,
    
    severityBreakdown: [
      { label: 'Critical', val: '0', height: '0%', class: 'bar-linux' },
      { label: 'High', val: '3', height: '50%', class: 'bar-mac' },
      { label: 'Medium', val: '8', height: '100%', class: 'bar-ios' },
      { label: 'Low', val: '0', height: '0%', class: 'bar-windows' },
    ],

    licenseBreakdown: [
      { name: 'MIT License', percentage: '58.6%', dotClass: 'dot-us' },
      { name: 'Apache 2.0', percentage: '29.3%', dotClass: 'dot-ca' },
      { name: 'GPL 3.0 (Warning)', percentage: '7.8%', dotClass: 'dot-mx' },
      { name: 'BSD 3-Clause', percentage: '4.3%', dotClass: 'dot-ot' },
    ],

    dependencyBreakdown: [
      { label: 'Direct', val: '88', height: '50%', class: 'bar-mac' },
      { label: 'Transitive', val: '424', height: '100%', class: 'bar-windows' },
      { label: 'DevDeps', val: '180', height: '80%', class: 'bar-ios' },
      { label: 'Bundled', val: '0', height: '0%', class: 'bar-android' },
      { label: 'Optional', val: '12', height: '20%', class: 'bar-other' },
      { label: 'Peer', val: '18', height: '25%', class: 'bar-linux' }
    ],

    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [8, 12, 10, 11, 14, 11],
      pathPoints: "M 50,120 C 100,120 100,90 150,90 C 200,90 200,105 250,105 C 300,105 300,100 350,100 C 400,100 400,80 450,80 C 500,80 500,100 550,100",
      fillPoints: "M 50,120 C 100,120 100,90 150,90 C 200,90 200,105 250,105 C 300,105 300,100 350,100 C 400,100 400,80 450,80 C 500,80 500,100 550,100 L 550,160 L 50,160 Z",
      coordinates: [
        { cx: 50, cy: 120, val: 8 },
        { cx: 150, cy: 90, val: 12 },
        { cx: 250, cy: 105, val: 10 },
        { cx: 350, cy: 100, val: 11 },
        { cx: 450, cy: 80, val: 14 },
        { cx: 550, cy: 100, val: 11 }
      ]
    },

    vulnerabilities: [
      {
        name: 'CVE-2026-1024 (kafkajs)',
        severity: 'High',
        description: 'Buffer allocation bypass leading to remote code execution in decompression streams',
        date: 'Jul 25, 2026',
        cve: 'CVE-2026-1024',
        status: 'Rejected',
        statusClass: 'rejected'
      },
      {
        name: 'CVE-2026-8911 (protobufjs)',
        severity: 'High',
        description: 'Prototype pollution through custom message decoding and extension configuration parsing',
        date: 'Jul 10, 2026',
        cve: 'CVE-2026-8911',
        status: 'Rejected',
        statusClass: 'rejected'
      },
      {
        name: 'CVE-2026-3023 (snappy)',
        severity: 'High',
        description: 'Out of bounds memory write and read access leaks in C-bindings compression driver',
        date: 'Jun 22, 2026',
        cve: 'CVE-2026-3023',
        status: 'Rejected',
        statusClass: 'rejected'
      }
    ],

    dependencies: [
      {
        name: 'kafkajs',
        description: 'Pure JS Apache Kafka system event message queue driver client',
        avatarLetter: 'KF',
        avatarBg: '#dbfaf6',
        avatarColor: '#80e2d6',
        version: 'v2.2.4',
        license: 'MIT',
        status: 'Rejected',
        statusClass: 'rejected'
      },
      {
        name: 'protobufjs',
        description: 'Protocol Buffers serialization and transmission schema parsing library',
        avatarLetter: 'PR',
        avatarBg: '#f3f3f3',
        avatarColor: '#707070',
        version: 'v7.2.5',
        license: 'BSD 3-Clause',
        status: 'Rejected',
        statusClass: 'rejected'
      },
      {
        name: 'snappy',
        description: 'Snappy compression format utility C++ Node driver binding',
        avatarLetter: 'SN',
        avatarBg: '#fff5e6',
        avatarColor: '#d97d24',
        version: 'v0.1.2',
        license: 'Apache 2.0',
        status: 'Rejected',
        statusClass: 'rejected'
      }
    ]
  }
];
