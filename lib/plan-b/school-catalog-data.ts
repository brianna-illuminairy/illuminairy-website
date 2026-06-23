import type { UsStateCode } from "@/lib/plan-b/us-states";

export type CatalogSchool = {
  id: string;
  name: string;
  state: UsStateCode;
  composite50: number;
  composite25?: number;
  composite75?: number;
  sourceLabel: string;
  sourceUrl: string;
  dataAsOf: string;
};

const CDS = "Common Data Set / admissions profile (SAT submitters midpoint)";
const ADM = "Admissions published SAT mid-range midpoint";

/** ~160 selective colleges — composite50 for SAT submitters. Review each cycle. */
export const SCHOOL_CATALOG_ENTRIES: CatalogSchool[] = [
  // AL
  { id: "auburn", name: "Auburn University", state: "AL", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://auburn.edu", dataAsOf: "2024-25" },
  { id: "alabama", name: "University of Alabama", state: "AL", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://ua.edu", dataAsOf: "2024-25" },
  { id: "uab", name: "UAB", state: "AL", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://uab.edu", dataAsOf: "2024-25" },
  // AK
  { id: "alaska-fairbanks", name: "University of Alaska Fairbanks", state: "AK", composite50: 1180, sourceLabel: ADM, sourceUrl: "https://uaf.edu", dataAsOf: "2024-25" },
  { id: "alaska-anchorage", name: "University of Alaska Anchorage", state: "AK", composite50: 1120, sourceLabel: ADM, sourceUrl: "https://uaa.alaska.edu", dataAsOf: "2024-25" },
  // AZ
  { id: "asu", name: "Arizona State University", state: "AZ", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://asu.edu", dataAsOf: "2024-25" },
  { id: "arizona", name: "University of Arizona", state: "AZ", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://arizona.edu", dataAsOf: "2024-25" },
  { id: "nau", name: "Northern Arizona University", state: "AZ", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://nau.edu", dataAsOf: "2024-25" },
  // AR
  { id: "arkansas", name: "University of Arkansas", state: "AR", composite50: 1210, sourceLabel: CDS, sourceUrl: "https://uark.edu", dataAsOf: "2024-25" },
  { id: "arkansas-state", name: "Arkansas State University", state: "AR", composite50: 1150, sourceLabel: ADM, sourceUrl: "https://astate.edu", dataAsOf: "2024-25" },
  // CA
  { id: "stanford", name: "Stanford University", state: "CA", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://stanford.edu", dataAsOf: "2024-25" },
  { id: "berkeley", name: "UC Berkeley", state: "CA", composite50: 1450, sourceLabel: CDS, sourceUrl: "https://berkeley.edu", dataAsOf: "2024-25" },
  { id: "ucla", name: "UCLA", state: "CA", composite50: 1450, sourceLabel: CDS, sourceUrl: "https://ucla.edu", dataAsOf: "2024-25" },
  { id: "usc", name: "USC", state: "CA", composite50: 1450, sourceLabel: CDS, sourceUrl: "https://usc.edu", dataAsOf: "2024-25" },
  { id: "ucsd", name: "UC San Diego", state: "CA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://ucsd.edu", dataAsOf: "2024-25" },
  { id: "uci", name: "UC Irvine", state: "CA", composite50: 1370, sourceLabel: CDS, sourceUrl: "https://uci.edu", dataAsOf: "2024-25" },
  { id: "ucsb", name: "UC Santa Barbara", state: "CA", composite50: 1350, sourceLabel: CDS, sourceUrl: "https://ucsb.edu", dataAsOf: "2024-25" },
  { id: "ucdavis", name: "UC Davis", state: "CA", composite50: 1330, sourceLabel: CDS, sourceUrl: "https://ucdavis.edu", dataAsOf: "2024-25" },
  // CO
  { id: "cu-boulder", name: "University of Colorado Boulder", state: "CO", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://colorado.edu", dataAsOf: "2024-25" },
  { id: "colorado-state", name: "Colorado State University", state: "CO", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://colostate.edu", dataAsOf: "2024-25" },
  { id: "du", name: "University of Denver", state: "CO", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://du.edu", dataAsOf: "2024-25" },
  // CT
  { id: "yale", name: "Yale University", state: "CT", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://yale.edu", dataAsOf: "2024-25" },
  { id: "uconn", name: "UConn", state: "CT", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://uconn.edu", dataAsOf: "2024-25" },
  { id: "wesleyan", name: "Wesleyan University", state: "CT", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://wesleyan.edu", dataAsOf: "2024-25" },
  // DE
  { id: "delaware", name: "University of Delaware", state: "DE", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://udel.edu", dataAsOf: "2024-25" },
  // DC
  { id: "georgetown", name: "Georgetown University", state: "DC", composite50: 1500, sourceLabel: ADM, sourceUrl: "https://georgetown.edu", dataAsOf: "2024-25" },
  { id: "gw", name: "George Washington University", state: "DC", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://gwu.edu", dataAsOf: "2024-25" },
  { id: "american", name: "American University", state: "DC", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://american.edu", dataAsOf: "2024-25" },
  { id: "howard", name: "Howard University", state: "DC", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://howard.edu", dataAsOf: "2024-25" },
  // FL
  { id: "uf", name: "University of Florida", state: "FL", composite50: 1400, sourceLabel: CDS, sourceUrl: "https://ufl.edu", dataAsOf: "2024-25" },
  { id: "fsu", name: "Florida State University", state: "FL", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://fsu.edu", dataAsOf: "2024-25" },
  { id: "um", name: "University of Miami", state: "FL", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://miami.edu", dataAsOf: "2024-25" },
  { id: "ucf", name: "UCF", state: "FL", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://ucf.edu", dataAsOf: "2024-25" },
  // GA — canonical scores synced with georgia-flagship-scores.ts
  { id: "georgia-tech", name: "Georgia Tech", state: "GA", composite50: 1460, composite25: 1370, composite75: 1530, sourceLabel: "Georgia Tech CDS 2024-25", sourceUrl: "https://irp.gatech.edu", dataAsOf: "2024-25" },
  { id: "uga", name: "University of Georgia", state: "GA", composite50: 1430, composite25: 1360, composite75: 1500, sourceLabel: "UGA Admissions Class of 2026", sourceUrl: "https://admissions.uga.edu", dataAsOf: "2026" },
  { id: "emory", name: "Emory University", state: "GA", composite50: 1510, composite25: 1480, composite75: 1540, sourceLabel: "Emory admitted students", sourceUrl: "https://apply.emory.edu", dataAsOf: "2025" },
  { id: "georgia-state", name: "Georgia State University", state: "GA", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://gsu.edu", dataAsOf: "2024-25" },
  // HI
  { id: "hawaii-manoa", name: "University of Hawaii at Manoa", state: "HI", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://manoa.hawaii.edu", dataAsOf: "2024-25" },
  // ID
  { id: "idaho", name: "University of Idaho", state: "ID", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://uidaho.edu", dataAsOf: "2024-25" },
  { id: "boise-state", name: "Boise State University", state: "ID", composite50: 1150, sourceLabel: ADM, sourceUrl: "https://boisestate.edu", dataAsOf: "2024-25" },
  // IL
  { id: "uchicago", name: "University of Chicago", state: "IL", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://uchicago.edu", dataAsOf: "2024-25" },
  { id: "northwestern", name: "Northwestern University", state: "IL", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://northwestern.edu", dataAsOf: "2024-25" },
  { id: "uiuc", name: "University of Illinois Urbana-Champaign", state: "IL", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://illinois.edu", dataAsOf: "2024-25" },
  { id: "loyola-chicago", name: "Loyola University Chicago", state: "IL", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://luc.edu", dataAsOf: "2024-25" },
  // IN
  { id: "notre-dame", name: "Notre Dame", state: "IN", composite50: 1500, sourceLabel: ADM, sourceUrl: "https://nd.edu", dataAsOf: "2024-25" },
  { id: "purdue", name: "Purdue University", state: "IN", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://purdue.edu", dataAsOf: "2024-25" },
  { id: "indiana", name: "Indiana University Bloomington", state: "IN", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://indiana.edu", dataAsOf: "2024-25" },
  // IA
  { id: "iowa", name: "University of Iowa", state: "IA", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://uiowa.edu", dataAsOf: "2024-25" },
  { id: "iowa-state", name: "Iowa State University", state: "IA", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://iastate.edu", dataAsOf: "2024-25" },
  // KS
  { id: "kansas", name: "University of Kansas", state: "KS", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://ku.edu", dataAsOf: "2024-25" },
  { id: "k-state", name: "Kansas State University", state: "KS", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://k-state.edu", dataAsOf: "2024-25" },
  // KY
  { id: "uk", name: "University of Kentucky", state: "KY", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://uky.edu", dataAsOf: "2024-25" },
  { id: "louisville", name: "University of Louisville", state: "KY", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://louisville.edu", dataAsOf: "2024-25" },
  // LA
  { id: "tulane", name: "Tulane University", state: "LA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://tulane.edu", dataAsOf: "2024-25" },
  { id: "lsu", name: "LSU", state: "LA", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://lsu.edu", dataAsOf: "2024-25" },
  // ME
  { id: "maine", name: "University of Maine", state: "ME", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://umaine.edu", dataAsOf: "2024-25" },
  { id: "bowdoin", name: "Bowdoin College", state: "ME", composite50: 1480, sourceLabel: CDS, sourceUrl: "https://bowdoin.edu", dataAsOf: "2024-25" },
  // MD
  { id: "umd", name: "University of Maryland", state: "MD", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://umd.edu", dataAsOf: "2024-25" },
  { id: "jhu", name: "Johns Hopkins University", state: "MD", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://jhu.edu", dataAsOf: "2024-25" },
  { id: "loyola-maryland", name: "Loyola University Maryland", state: "MD", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://loyola.edu", dataAsOf: "2024-25" },
  // MA
  { id: "harvard", name: "Harvard University", state: "MA", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://harvard.edu", dataAsOf: "2024-25" },
  { id: "mit", name: "MIT", state: "MA", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://mit.edu", dataAsOf: "2024-25" },
  { id: "boston-university", name: "Boston University", state: "MA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://bu.edu", dataAsOf: "2024-25" },
  { id: "bc", name: "Boston College", state: "MA", composite50: 1440, sourceLabel: CDS, sourceUrl: "https://bc.edu", dataAsOf: "2024-25" },
  { id: "umass-amherst", name: "UMass Amherst", state: "MA", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://umass.edu", dataAsOf: "2024-25" },
  // MI
  { id: "umich", name: "University of Michigan", state: "MI", composite50: 1450, sourceLabel: CDS, sourceUrl: "https://umich.edu", dataAsOf: "2024-25" },
  { id: "msu", name: "Michigan State University", state: "MI", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://msu.edu", dataAsOf: "2024-25" },
  // MN
  { id: "minnesota", name: "University of Minnesota", state: "MN", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://umn.edu", dataAsOf: "2024-25" },
  { id: "carleton", name: "Carleton College", state: "MN", composite50: 1480, sourceLabel: CDS, sourceUrl: "https://carleton.edu", dataAsOf: "2024-25" },
  // MS
  { id: "ole-miss", name: "University of Mississippi", state: "MS", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://olemiss.edu", dataAsOf: "2024-25" },
  { id: "mississippi-state", name: "Mississippi State University", state: "MS", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://msstate.edu", dataAsOf: "2024-25" },
  // MO
  { id: "washu", name: "Washington University in St. Louis", state: "MO", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://wustl.edu", dataAsOf: "2024-25" },
  { id: "mizzou", name: "University of Missouri", state: "MO", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://missouri.edu", dataAsOf: "2024-25" },
  // MT
  { id: "montana", name: "University of Montana", state: "MT", composite50: 1180, sourceLabel: ADM, sourceUrl: "https://umt.edu", dataAsOf: "2024-25" },
  { id: "montana-state", name: "Montana State University", state: "MT", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://montana.edu", dataAsOf: "2024-25" },
  // NE
  { id: "nebraska", name: "University of Nebraska–Lincoln", state: "NE", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://unl.edu", dataAsOf: "2024-25" },
  // NV
  { id: "unlv", name: "UNLV", state: "NV", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://unlv.edu", dataAsOf: "2024-25" },
  { id: "unr", name: "University of Nevada, Reno", state: "NV", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://unr.edu", dataAsOf: "2024-25" },
  // NH
  { id: "unh", name: "University of New Hampshire", state: "NH", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://unh.edu", dataAsOf: "2024-25" },
  { id: "dartmouth", name: "Dartmouth College", state: "NH", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://dartmouth.edu", dataAsOf: "2024-25" },
  // NJ
  { id: "princeton", name: "Princeton University", state: "NJ", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://princeton.edu", dataAsOf: "2024-25" },
  { id: "rutgers", name: "Rutgers University", state: "NJ", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://rutgers.edu", dataAsOf: "2024-25" },
  { id: "njit", name: "NJIT", state: "NJ", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://njit.edu", dataAsOf: "2024-25" },
  // NM
  { id: "unm", name: "University of New Mexico", state: "NM", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://unm.edu", dataAsOf: "2024-25" },
  { id: "nmsu", name: "New Mexico State University", state: "NM", composite50: 1120, sourceLabel: ADM, sourceUrl: "https://nmsu.edu", dataAsOf: "2024-25" },
  // NY
  { id: "columbia", name: "Columbia University", state: "NY", composite50: 1540, sourceLabel: ADM, sourceUrl: "https://columbia.edu", dataAsOf: "2024-25" },
  { id: "cornell", name: "Cornell University", state: "NY", composite50: 1500, sourceLabel: ADM, sourceUrl: "https://cornell.edu", dataAsOf: "2024-25" },
  { id: "nyu", name: "NYU", state: "NY", composite50: 1450, sourceLabel: CDS, sourceUrl: "https://nyu.edu", dataAsOf: "2024-25" },
  { id: "syracuse", name: "Syracuse University", state: "NY", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://syracuse.edu", dataAsOf: "2024-25" },
  { id: "binghamton", name: "Binghamton University (SUNY)", state: "NY", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://binghamton.edu", dataAsOf: "2024-25" },
  // NC
  { id: "duke", name: "Duke University", state: "NC", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://duke.edu", dataAsOf: "2024-25" },
  { id: "unc", name: "UNC Chapel Hill", state: "NC", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://unc.edu", dataAsOf: "2024-25" },
  { id: "nc-state", name: "NC State", state: "NC", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://ncsu.edu", dataAsOf: "2024-25" },
  { id: "wake-forest", name: "Wake Forest", state: "NC", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://wfu.edu", dataAsOf: "2024-25" },
  // ND
  { id: "ndsu", name: "North Dakota State University", state: "ND", composite50: 1180, sourceLabel: ADM, sourceUrl: "https://ndsu.edu", dataAsOf: "2024-25" },
  { id: "und", name: "University of North Dakota", state: "ND", composite50: 1150, sourceLabel: ADM, sourceUrl: "https://und.edu", dataAsOf: "2024-25" },
  // OH
  { id: "ohio-state", name: "Ohio State University", state: "OH", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://osu.edu", dataAsOf: "2024-25" },
  { id: "case-western", name: "Case Western Reserve University", state: "OH", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://case.edu", dataAsOf: "2024-25" },
  { id: "miami-oh", name: "Miami University (Ohio)", state: "OH", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://miamioh.edu", dataAsOf: "2024-25" },
  // OK
  { id: "ou", name: "University of Oklahoma", state: "OK", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://ou.edu", dataAsOf: "2024-25" },
  { id: "okstate", name: "Oklahoma State University", state: "OK", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://okstate.edu", dataAsOf: "2024-25" },
  { id: "tulsa", name: "University of Tulsa", state: "OK", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://utulsa.edu", dataAsOf: "2024-25" },
  // OR
  { id: "oregon", name: "University of Oregon", state: "OR", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://uoregon.edu", dataAsOf: "2024-25" },
  { id: "oregon-state", name: "Oregon State University", state: "OR", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://oregonstate.edu", dataAsOf: "2024-25" },
  // PA
  { id: "upenn", name: "UPenn", state: "PA", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://upenn.edu", dataAsOf: "2024-25" },
  { id: "cmu", name: "Carnegie Mellon University", state: "PA", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://cmu.edu", dataAsOf: "2024-25" },
  { id: "penn-state", name: "Penn State", state: "PA", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://psu.edu", dataAsOf: "2024-25" },
  { id: "pitt", name: "University of Pittsburgh", state: "PA", composite50: 1360, sourceLabel: CDS, sourceUrl: "https://pitt.edu", dataAsOf: "2024-25" },
  // RI
  { id: "brown", name: "Brown University", state: "RI", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://brown.edu", dataAsOf: "2024-25" },
  { id: "uri", name: "University of Rhode Island", state: "RI", composite50: 1220, sourceLabel: CDS, sourceUrl: "https://uri.edu", dataAsOf: "2024-25" },
  // SC
  { id: "south-carolina", name: "University of South Carolina", state: "SC", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://sc.edu", dataAsOf: "2024-25" },
  { id: "clemson", name: "Clemson University", state: "SC", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://clemson.edu", dataAsOf: "2024-25" },
  // SD
  { id: "south-dakota", name: "University of South Dakota", state: "SD", composite50: 1180, sourceLabel: ADM, sourceUrl: "https://usd.edu", dataAsOf: "2024-25" },
  { id: "sdsu", name: "South Dakota State University", state: "SD", composite50: 1150, sourceLabel: ADM, sourceUrl: "https://sdstate.edu", dataAsOf: "2024-25" },
  // TN
  { id: "vanderbilt", name: "Vanderbilt University", state: "TN", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://vanderbilt.edu", dataAsOf: "2024-25" },
  { id: "ut-knoxville", name: "University of Tennessee", state: "TN", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://utk.edu", dataAsOf: "2024-25" },
  // TX
  { id: "ut-austin", name: "UT Austin", state: "TX", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://utexas.edu", dataAsOf: "2024-25" },
  { id: "rice", name: "Rice University", state: "TX", composite50: 1520, sourceLabel: ADM, sourceUrl: "https://rice.edu", dataAsOf: "2024-25" },
  { id: "texas-am", name: "Texas A&M", state: "TX", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://tamu.edu", dataAsOf: "2024-25" },
  { id: "texas-tech", name: "Texas Tech", state: "TX", composite50: 1240, sourceLabel: CDS, sourceUrl: "https://ttu.edu", dataAsOf: "2024-25" },
  { id: "baylor", name: "Baylor University", state: "TX", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://baylor.edu", dataAsOf: "2024-25" },
  { id: "smu", name: "SMU", state: "TX", composite50: 1380, sourceLabel: CDS, sourceUrl: "https://smu.edu", dataAsOf: "2024-25" },
  // UT
  { id: "utah", name: "University of Utah", state: "UT", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://utah.edu", dataAsOf: "2024-25" },
  { id: "byu", name: "Brigham Young University", state: "UT", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://byu.edu", dataAsOf: "2024-25" },
  // VT
  { id: "uvm", name: "University of Vermont", state: "VT", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://uvm.edu", dataAsOf: "2024-25" },
  { id: "middlebury", name: "Middlebury College", state: "VT", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://middlebury.edu", dataAsOf: "2024-25" },
  // VA
  { id: "uva", name: "University of Virginia", state: "VA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://virginia.edu", dataAsOf: "2024-25" },
  { id: "vt", name: "Virginia Tech", state: "VA", composite50: 1320, sourceLabel: CDS, sourceUrl: "https://vt.edu", dataAsOf: "2024-25" },
  { id: "wm", name: "William & Mary", state: "VA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://wm.edu", dataAsOf: "2024-25" },
  // WA
  { id: "uw", name: "University of Washington", state: "WA", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://washington.edu", dataAsOf: "2024-25" },
  { id: "wsu", name: "Washington State University", state: "WA", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://wsu.edu", dataAsOf: "2024-25" },
  // WV
  { id: "wvu", name: "West Virginia University", state: "WV", composite50: 1180, sourceLabel: CDS, sourceUrl: "https://wvu.edu", dataAsOf: "2024-25" },
  // WI
  { id: "wisconsin", name: "University of Wisconsin–Madison", state: "WI", composite50: 1420, sourceLabel: CDS, sourceUrl: "https://wisc.edu", dataAsOf: "2024-25" },
  { id: "marquette", name: "Marquette University", state: "WI", composite50: 1280, sourceLabel: CDS, sourceUrl: "https://marquette.edu", dataAsOf: "2024-25" },
  // WY
  { id: "wyoming", name: "University of Wyoming", state: "WY", composite50: 1150, sourceLabel: ADM, sourceUrl: "https://uwyo.edu", dataAsOf: "2024-25" },
];
