export interface DataLog {
  id: string;
  title: string;
  type: 'encrypted' | 'corrupted' | 'redacted' | 'fragment' | 'classified';
  content: string[];
  date?: string;
  classification?: string;
}

export const floorLore: { [key: number]: DataLog[] } = {
  7: [
    {
      id: 'f7_log1',
      title: 'SECURITY BREACH REPORT',
      type: 'encrypted',
      content: [
        'Agent Elena Cross accessed Data Room at 14:32 on 2057.10.20.',
        'Downloaded classified files on Project Ascension before containment.',
        'Subject discovered test subject mortality rates and neural transfer failures.',
        'Containment team deployed. Subject escaped to lower floors.',
        'Status: HIGH PRIORITY THREAT. Capture alive for questioning.',
      ],
      date: '2057.10.20',
      classification: 'LEVEL 9 CLEARANCE',
    },
  ],
  6: [
    {
      id: 'f6_log1',
      title: 'MEDICAL EXAMINATION LOG',
      type: 'corrupted',
      content: [
        'Patient: Elena Cross. Condition: Sedated after capture.',
        'Neural mapping in progress for consciousness transfer procedure.',
        'Subject shows unusual resistance to sedatives. Increasing dosage.',
        'Dr. Ashford notes: Patient repeatedly calls for her brother Simon.',
        'Proceeding with memory extraction despite ethical concerns.',
      ],
      classification: 'MEDICAL RECORDS',
      date: '2057.10.21',
    },
  ],
  5: [
    {
      id: 'f5_log1',
      title: 'STAFF DISAPPEARANCE LOG',
      type: 'redacted',
      content: [
        'Kitchen worker Marcus Chen reported missing on 2057.10.12.',
        'Subject was scheduled for Project Ascension trial that same day.',
        'Official report: Voluntary resignation. Reality: Failed transfer test.',
        'Body disposed through industrial kitchen equipment per Protocol 7.',
        'Three other kitchen staff have vanished this month under similar circumstances.',
      ],
      date: '2057.10.15',
    },
  ],
  4: [
    {
      id: 'f4_log1',
      title: 'FINANCIAL AUDIT TRAIL',
      type: 'fragment',
      content: [
        'Project Ascension budget: 47 million credits diverted from operations.',
        'Expenditures: AI server farms, neural extraction equipment, containment pods.',
        'Test subjects listed as equipment costs to hide true nature of project.',
        'Accountant Sarah Lin flagged these discrepancies on 2057.09.28.',
        'Elena Cross discovered this file before her capture on Floor 7.',
      ],
      date: '2057.10.01',
    },
  ],
  3: [
    {
      id: 'f3_log1',
      title: 'DOCUMENT FABRICATION ORDERS',
      type: 'classified',
      content: [
        'Printing Room generates forged death certificates for failed test subjects.',
        'Standard cause of death: Industrial accident. Standard witnesses: None.',
        '1,421 certificates produced to date for Project Ascension failures.',
        'Next of kin notified via automated system. No questions asked.',
        'Elena Cross discovered this archive before her capture.',
      ],
      classification: 'EYES ONLY',
      date: '2057.10.18',
    },
  ],
  2: [
    {
      id: 'f2_log1',
      title: 'SLEEPING POD MANIFEST',
      type: 'encrypted',
      content: [
        'Pod 7 - Subject: Elena Cross. Status: Neural extraction in progress.',
        'Subject consciousness suspended but scans show awareness patterns.',
        'Memory backup: 89% complete. Personality matrix: Degrading.',
        'Pod designed to keep failed subjects alive for potential re-extraction.',
        'Warning: Subject vital signs unstable. Brother Simon Cross en route to facility.',
      ],
      date: '2057.10.22',
    },
  ],
  1: [
    {
      id: 'f1_log1',
      title: 'PROJECT ASCENSION FINAL REPORT',
      type: 'classified',
      content: [
        'The Ballroom contains the Titan AI - guardian of consciousness transfer chamber.',
        'Success rate: 0.03%. Only 1 in 3,000 subjects survive the transfer.',
        'CEO Hammond approved elimination of witnesses, including Elena Cross.',
        'Neural patterns extracted from subjects are stored in Titan AI core.',
        'Agent Simon Cross has breached all security. Titan authorised for lethal force.',
      ],
      date: '2057.10.23',
      classification: 'TERMINAL CLEARANCE',
    },
  ],
};

// Helper to get unread logs for a floor
export function getFloorLogs(floor: number): DataLog[] {
  return floorLore[floor] || [];
}

// Get total log count
export function getTotalLogsCount(): number {
  return Object.values(floorLore).reduce((sum, logs) => sum + logs.length, 0);
}
