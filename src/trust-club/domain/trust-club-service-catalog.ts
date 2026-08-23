import type {
  TrustClubPlainLanguageDefinition,
} from './trust-club-service-definition.contracts';

export const TRUST_CLUB_SERVICE_CATALOG = {
  STANDARD_TRUST_FORMATION: {
    term: 'Standard Trust Formation',

    meaning:
      'The standardized Trust Club process for preparing the core records and documents used to establish a Member Trust within the Trust Club framework.',

    purpose:
      'To give a Member a clear, repeatable, documented starting point for establishing a standard Trust without requiring custom drafting for an ordinary formation case.',

    whatTrustClubDoes: [
      'Collects the information required by the standard formation workflow.',
      'Prepares the standard Trust Instrument used by the applicable Trust Club service.',
      'Records the identified Settlor, Trustee, Beneficiary and optional Protector roles.',
      'Records the stated Trust purpose.',
      'Records the initial property information supplied for the Trust.',
      'Creates the corresponding internal Trust record after the required formation steps are completed.',
    ],

    whatMemberReceives: [
      'Standard Trust Instrument.',
      'Trust identity record.',
      'Trust parties and roles record.',
      'Trust purpose record.',
      'Initial property schedule.',
      'Access to the applicable standard Trust records and documents.',
    ],

    memberResponsibilities: [
      'Provide complete and accurate information.',
      'Identify the intended Trust parties and their roles.',
      'Review the generated documents before acceptance.',
      'Provide required confirmations and signatures.',
      'Identify any circumstance that does not fit the standard formation workflow.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_CREATE_STANDARD',

    serviceEndsWhen:
      'The standard formation documents and internal Trust record included in the service have been completed and made available to the Member.',

    notIncluded: [
      'Custom Trust drafting.',
      'External legal opinion.',
      'Tax advice or tax filing.',
      'Accounting services.',
      'Bank account opening.',
      'External identification number issuance.',
      'External registry filing unless separately stated.',
      'Third-party approval or recognition.',
    ],

    optionalAddOns: [
      'Custom amendment or drafting review.',
      'External identification assistance.',
      'Assisted banking activation.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'MEMBER_SIGNATURE',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'If you use the standard formation process, Trust Club prepares the standard formation package and creates the corresponding internal Trust record. This does not automatically open a bank account or obtain an external tax or identification number.',
  },

  INTERNAL_TRUST_REGISTRATION: {
    term: 'Internal Trust Registration',

    meaning:
      'Creation and maintenance of the Trust record and unique Trust reference within the applicable internal Trust Club registry framework.',

    purpose:
      'To provide an identifiable internal record for the Trust and distinguish it from other Member Trusts.',

    whatTrustClubDoes: [
      'Creates an internal Trust registry record.',
      'Assigns the applicable unique Trust reference.',
      'Records the internal Trust status.',
      'Maintains the corresponding internal registration information.',
      'Makes an applicable internal certificate or extract available when the service provides one.',
    ],

    whatMemberReceives: [
      'Internal Trust registry record.',
      'Unique Trust reference.',
      'Recorded Trust status.',
      'Applicable internal registry evidence or extract.',
    ],

    memberResponsibilities: [
      'Provide accurate Trust information.',
      'Report changes that affect the recorded information.',
      'Use the internal reference accurately when identifying the Trust within the applicable framework.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_REGISTRY_RECORD',

    serviceEndsWhen:
      'The applicable internal Trust registration record has been created or the requested standard registry update has been completed.',

    notIncluded: [
      'Company registration.',
      'Government registration outside the applicable internal framework.',
      'Tax identification number.',
      'Bank account approval.',
      'Recognition by an external institution.',
      'External legal-status determination.',
    ],

    optionalAddOns: [
      'External identification assistance.',
      'External document preparation.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'An internal Trust Club registration or reference does not itself require an external bank, authority, registry or other institution to recognize or accept the Trust.',

    plainLanguageExample:
      'Your Trust can receive its internal Trust record and reference through the service. That internal record is not the same thing as a bank account, tax number or registration issued by another authority.',
  },

  STANDARD_TRUST_MAINTENANCE: {
    term: 'Standard Trust Maintenance',

    meaning:
      'Routine administrative maintenance of the Trust records and standard documents expressly included in the Membership Plan.',

    purpose:
      'To keep the Trust administrative record organized and current as ordinary changes and recordkeeping events occur.',

    whatTrustClubDoes: [
      'Maintains standard Trust status information.',
      'Processes eligible standard record updates.',
      'Maintains document history.',
      'Provides applicable standard templates.',
      'Maintains the applicable administrative records included in the service.',
    ],

    whatMemberReceives: [
      'Updated standard Trust records.',
      'Document history.',
      'Applicable standard maintenance templates.',
      'Access to maintained Trust information.',
    ],

    memberResponsibilities: [
      'Provide accurate updates when circumstances change.',
      'Review updated records.',
      'Complete required confirmations.',
      'Escalate non-standard matters instead of representing them as routine maintenance.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_MAINTENANCE',

    serviceEndsWhen:
      'The requested eligible standard administrative update has been recorded and the resulting record or document has been made available.',

    notIncluded: [
      'Trustee decision-making by Trust Club.',
      'Investment management.',
      'Bookkeeping services.',
      'Accounting services.',
      'Tax filing.',
      'Legal representation.',
      'Asset custody.',
      'Banking execution.',
      'Payment execution.',
      'External registration.',
    ],

    optionalAddOns: [
      'Professional review.',
      'Custom amendment.',
      'Assisted external process.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'If an address or other eligible standard record changes, the maintenance service can update the relevant Trust record. It does not mean Trust Club takes over the Trustee role or performs accounting, tax or banking work.',
  },

  SELF_MANAGEMENT_TOOLBOX: {
    term: 'Self-Management Toolbox',

    meaning:
      'The collection of standard forms, explanations, checklists, workflows and recordkeeping tools provided so an authorized Member can administer ordinary Trust matters directly.',

    purpose:
      'To make routine Trust administration understandable and manageable without requiring Trust Club personnel to perform every ordinary administrative step.',

    whatTrustClubDoes: [
      'Provides standard administrative workflows.',
      'Provides applicable forms and templates.',
      'Provides plain-language explanations.',
      'Provides standard checklists.',
      'Provides standard resolution tools.',
      'Provides access to eligible Trust record-management functions.',
    ],

    whatMemberReceives: [
      'Standard Trust administration toolbox.',
      'Applicable forms and templates.',
      'Checklists.',
      'Standard workflows.',
      'Plain-language guidance for supported actions.',
    ],

    memberResponsibilities: [
      'Use the tools only where authorized.',
      'Review the applicable Trust Instrument before acting.',
      'Provide accurate information.',
      'Obtain additional assistance where the workflow identifies an external or professional requirement.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_SELF_MANAGEMENT_TOOLBOX',

    serviceEndsWhen:
      'The applicable tool, workflow, template or guidance included in the service has been provided for the supported action.',

    notIncluded: [
      'Automatic Trustee decision-making.',
      'Legal representation.',
      'Investment advice.',
      'Accounting.',
      'Tax advice.',
      'Guaranteed external completion.',
    ],

    optionalAddOns: [
      'Professional review.',
      'Assisted external process.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'If you need to document an ordinary Trustee decision, the Toolbox can provide the applicable standard workflow and template. You remain responsible for making the decision if you hold the required authority.',
  },

  ASSET_REGISTER: {
    term: 'Asset Register',

    meaning:
      'The internal record used to identify and track assets declared or recorded in connection with the Trust.',

    purpose:
      'To maintain an organized record of Trust assets and relevant asset events.',

    whatTrustClubDoes: [
      'Creates and maintains the Trust Asset Register.',
      'Records information supplied for eligible assets.',
      'Records standard asset additions.',
      'Records standard asset removals.',
      'Maintains supporting-document references where applicable.',
    ],

    whatMemberReceives: [
      'Trust Asset Register.',
      'Asset records.',
      'Applicable asset addition or removal records.',
      'Supporting-document references where available.',
    ],

    memberResponsibilities: [
      'Provide accurate asset information.',
      'Provide supporting evidence when required.',
      'Confirm that the person acting has authority regarding the asset.',
      'Complete any external transfer, registration or title requirement that applies to the asset.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_ASSET_REGISTER_UPDATE',

    serviceEndsWhen:
      'The eligible asset information and requested internal asset event have been recorded in the Trust Asset Register.',

    notIncluded: [
      'Proof of external ownership merely from internal recording.',
      'External title transfer.',
      'Government registry transfer.',
      'Custodian transfer.',
      'Asset valuation.',
      'Legal title opinion.',
    ],

    optionalAddOns: [
      'Professional review.',
      'External process assistance.',
      'Valuation coordination where separately offered.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Recording an asset internally does not itself complete any separate title, registry, custody or ownership-transfer requirement that may apply externally.',

    plainLanguageExample:
      'A property or other asset can be listed in the Trust Asset Register. If ownership of that asset must also be changed in an external registry, that separate step is still required.',
  },

  CONTRIBUTION_RECORDING: {
    term: 'Contribution Recording',

    meaning:
      'Internal documentation of money or property reported as contributed to the Trust.',

    purpose:
      'To preserve a clear record of contributions associated with the Trust.',

    whatTrustClubDoes: [
      'Records the contribution information.',
      'Records the contributing party where applicable.',
      'Records supporting evidence references.',
      'Updates the applicable internal Trust records.',
    ],

    whatMemberReceives: [
      'Contribution record.',
      'Applicable supporting evidence reference.',
      'Updated internal Trust record.',
    ],

    memberResponsibilities: [
      'Provide accurate contribution information.',
      'Provide evidence where required.',
      'Complete any actual transfer required for the contributed property.',
      'Address applicable external tax, title or reporting requirements.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_ASSET_REGISTER_UPDATE',

    serviceEndsWhen:
      'The contribution information and applicable supporting reference have been recorded internally.',

    notIncluded: [
      'Execution of a bank transfer.',
      'External title transfer.',
      'Tax determination.',
      'Tax filing.',
      'Valuation.',
    ],

    optionalAddOns: [
      'Professional review.',
      'External process assistance.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'An internal contribution record does not itself prove completion of an external transfer or determine tax treatment.',

    plainLanguageExample:
      'If money is contributed to the Trust, the service can record the contribution and its evidence. The record itself does not move the money.',
  },

  INCOME_EXPENSE_RECORDING: {
    term: 'Income and Expense Recording',

    meaning:
      'Administrative recording of income and expense events reported for the Trust.',

    purpose:
      'To help the Member maintain an organized internal history of ordinary Trust financial events.',

    whatTrustClubDoes: [
      'Records eligible income entries.',
      'Records eligible expense entries.',
      'Maintains descriptions and supporting references.',
      'Makes the recorded history available through the applicable Trust records.',
    ],

    whatMemberReceives: [
      'Income records.',
      'Expense records.',
      'Supporting-document references.',
      'Internal transaction history for the supported records.',
    ],

    memberResponsibilities: [
      'Provide accurate transaction information.',
      'Retain appropriate supporting documents.',
      'Determine whether professional accounting or tax treatment is required.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_MAINTENANCE',

    serviceEndsWhen:
      'The eligible income or expense information has been recorded internally.',

    notIncluded: [
      'Professional bookkeeping.',
      'Financial statement preparation.',
      'Accounting opinion.',
      'Audit.',
      'Tax return preparation.',
      'Tax filing.',
    ],

    optionalAddOns: [
      'Professional accounting review where separately available.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'You may record that the Trust received income or paid an expense. This creates an internal administrative record; it is not a tax return or professional set of accounts.',
  },

  DISTRIBUTION_RECORDING: {
    term: 'Distribution Recording',

    meaning:
      'Internal documentation of an authorized Trust distribution or proposed distribution to a Beneficiary.',

    purpose:
      'To preserve the Trust record of distributions and the authority supporting them.',

    whatTrustClubDoes: [
      'Provides the applicable standard distribution workflow.',
      'Records the distribution information.',
      'Provides an applicable standard resolution where required.',
      'Records supporting evidence references.',
    ],

    whatMemberReceives: [
      'Distribution record.',
      'Applicable standard resolution.',
      'Supporting-document references.',
    ],

    memberResponsibilities: [
      'Confirm authority for the distribution.',
      'Confirm the correct Beneficiary and amount or property.',
      'Complete any actual payment or asset transfer.',
      'Address external tax or reporting requirements where applicable.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_RESOLUTIONS',

    serviceEndsWhen:
      'The supported internal distribution documentation has been completed and recorded.',

    notIncluded: [
      'Actual bank or blockchain transfer.',
      'Tax advice.',
      'Tax withholding determination.',
      'External reporting.',
      'Beneficiary bank approval.',
    ],

    optionalAddOns: [
      'Professional review.',
      'External payment or banking assistance where separately offered.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Recording or authorizing a distribution internally does not itself execute the external transfer of money or property.',

    plainLanguageExample:
      'The Trust can document a distribution to a Beneficiary. The actual payment remains a separate financial action.',
  },

  STANDARD_TRUSTEE_RESOLUTIONS: {
    term: 'Standard Trustee Resolutions',

    meaning:
      'Standardized documents used to record eligible Trustee decisions within supported Trust Club workflows.',

    purpose:
      'To create consistent evidence of ordinary Trustee decisions.',

    whatTrustClubDoes: [
      'Provides supported standard resolution templates.',
      'Populates eligible standard information.',
      'Records the completed resolution.',
      'Maintains the resolution in the applicable Trust document history.',
    ],

    whatMemberReceives: [
      'Applicable standard resolution.',
      'Recorded resolution history.',
    ],

    memberResponsibilities: [
      'Hold the authority required to make the decision.',
      'Review the resolution.',
      'Confirm the information is accurate.',
      'Obtain additional review where the matter is non-standard.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_RESOLUTIONS',

    serviceEndsWhen:
      'The supported standard resolution has been prepared and recorded.',

    notIncluded: [
      'Custom transaction drafting.',
      'Legal opinion.',
      'Professional approval of a complex transaction.',
    ],

    optionalAddOns: [
      'Custom drafting.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
      'MEMBER_SIGNATURE',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'A Trustee making an ordinary supported decision can use a standard resolution to document that decision. A complex transaction may require separate review.',
  },

  BENEFICIARY_ADMINISTRATION: {
    term: 'Beneficiary Administration',

    meaning:
      'Standard administrative recording of eligible Beneficiary information and supported Beneficiary changes.',

    purpose:
      'To keep Beneficiary records consistent with the applicable Trust documentation.',

    whatTrustClubDoes: [
      'Maintains Beneficiary records.',
      'Provides supported standard change workflows.',
      'Records eligible additions or changes.',
      'Updates applicable internal Trust records.',
    ],

    whatMemberReceives: [
      'Updated Beneficiary record.',
      'Applicable standard change documentation.',
    ],

    memberResponsibilities: [
      'Confirm authority to make the requested change.',
      'Provide accurate Beneficiary information.',
      'Identify any restriction contained in the Trust Instrument.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_ROLE_RECORDS',

    serviceEndsWhen:
      'The eligible standard Beneficiary update has been completed and recorded.',

    notIncluded: [
      'A change prohibited by the Trust Instrument.',
      'Custom amendment of the Trust Instrument.',
      'Tax or legal advice concerning the change.',
    ],

    optionalAddOns: [
      'Trust amendment.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: false,

    plainLanguageExample:
      'If the Trust permits an eligible Beneficiary change, the standard workflow can document it. If the Trust Instrument itself must first be amended, that is a separate service.',
  },

  TRUSTEE_PROTECTOR_ADMINISTRATION: {
    term: 'Trustee and Protector Administration',

    meaning:
      'Standard administrative documentation of eligible Trustee or Protector appointments, resignations or changes.',

    purpose:
      'To maintain a clear record of who holds the relevant Trust roles.',

    whatTrustClubDoes: [
      'Provides supported standard role-change workflows.',
      'Records eligible appointments.',
      'Records eligible resignations.',
      'Updates the internal Trust role record.',
      'Maintains applicable standard documents.',
    ],

    whatMemberReceives: [
      'Updated role record.',
      'Applicable standard appointment, resignation or change documentation.',
    ],

    memberResponsibilities: [
      'Confirm authority for the change.',
      'Provide accurate information.',
      'Obtain required signatures.',
      'Complete any external notification or update separately required.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_CHANGE_REQUESTS',

    serviceEndsWhen:
      'The supported internal role change and corresponding standard documentation have been completed.',

    notIncluded: [
      'Bank account signatory update.',
      'Government registry update.',
      'Custodian update.',
      'Custom legal restructuring.',
    ],

    optionalAddOns: [
      'Assisted external update.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
      'MEMBER_SIGNATURE',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'An internal role change does not automatically update the records of a bank, registry, custodian or other external institution.',

    plainLanguageExample:
      'A new Trustee can be recorded through the supported internal process. If a bank also lists the old Trustee as a signatory, the bank must be updated separately.',
  },

  CONTRACT_ADMINISTRATION: {
    term: 'Contract Administration',

    meaning:
      'Administrative tools for recording and organizing contracts entered into by or for the Trust.',

    purpose:
      'To maintain evidence and records of Trust contractual activity.',

    whatTrustClubDoes: [
      'Provides a contract-recording workflow.',
      'Maintains the applicable contract register.',
      'Provides an authority checklist.',
      'Provides an applicable standard resolution tool.',
      'Stores or references the applicable contract record.',
    ],

    whatMemberReceives: [
      'Contract register entry.',
      'Authority checklist.',
      'Applicable standard resolution.',
      'Contract-document reference.',
    ],

    memberResponsibilities: [
      'Confirm authority to enter the contract.',
      'Review the contract terms.',
      'Obtain professional advice where appropriate.',
      'Provide accurate contract information.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_STANDARD_MAINTENANCE',

    serviceEndsWhen:
      'The supported contract information and internal authority documentation have been recorded.',

    notIncluded: [
      'Negotiation.',
      'Complex contract drafting.',
      'Legal review.',
      'Legal representation.',
      'Litigation.',
      'Counterparty approval.',
    ],

    optionalAddOns: [
      'Professional contract review where separately available.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Recording a contract does not guarantee counterparty performance, enforceability or any external outcome.',

    plainLanguageExample:
      'The Trust may record a contract and the authority supporting it. Trust Club does not become the lawyer or negotiating party merely because the contract is recorded.',
  },

  INVESTMENT_RECORDING: {
    term: 'Investment Recording',

    meaning:
      'Administrative recording of investment activity reported for the Trust.',

    purpose:
      'To maintain an organized Trust record of investments and related asset information.',

    whatTrustClubDoes: [
      'Records investment information.',
      'Updates applicable asset records.',
      'Maintains supporting-document references.',
      'Provides the applicable internal recordkeeping workflow.',
    ],

    whatMemberReceives: [
      'Investment record.',
      'Updated applicable Asset Register entry.',
      'Supporting-document references.',
    ],

    memberResponsibilities: [
      'Make investment decisions only where properly authorized.',
      'Provide accurate investment information.',
      'Obtain investment, tax or legal advice where required or desired.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'TRUST_ASSET_REGISTER_UPDATE',

    serviceEndsWhen:
      'The reported investment information has been recorded in the applicable internal Trust records.',

    notIncluded: [
      'Investment advice.',
      'Investment recommendation.',
      'Portfolio management.',
      'Brokerage execution.',
      'Custody.',
      'Performance guarantee.',
    ],

    optionalAddOns: [
      'Professional review where separately available.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Trust Club recording does not recommend an investment, execute it, guarantee its value or guarantee its performance.',

    plainLanguageExample:
      'If the authorized Trustee makes an investment, the investment may be recorded in the Trust records. The recording service does not tell the Trustee what to invest in.',
  },

  TRUST_AMENDMENT: {
    term: 'Trust Amendment',

    meaning:
      'A controlled process for changing provisions of an existing Trust Instrument where such change is permitted and appropriate.',

    purpose:
      'To separate substantive Trust Instrument changes from routine administrative maintenance.',

    whatTrustClubDoes: [
      'Receives the amendment request.',
      'Identifies the requested change.',
      'Routes the matter through the applicable review workflow.',
      'Prepares or coordinates the amendment documentation included in the separately approved scope.',
      'Records the completed amendment when applicable.',
    ],

    whatMemberReceives: [
      'Amendment workflow.',
      'Documents included in the approved amendment scope.',
      'Updated internal document record when completed.',
    ],

    memberResponsibilities: [
      'Explain the requested change accurately.',
      'Confirm authority for the requested amendment.',
      'Provide required supporting information.',
      'Approve any separate scope and fee before add-on work begins.',
    ],

    includedInBaseMembership: false,

    requiredEntitlement:
      'PROFESSIONAL_REVIEW',

    serviceEndsWhen:
      'The separately approved amendment scope has been completed and the applicable internal records have been updated.',

    notIncluded: [
      'Unquoted professional work.',
      'External legal opinion unless expressly included.',
      'Tax opinion unless expressly included.',
      'Third-party approval.',
    ],

    optionalAddOns: [
      'Legal review.',
      'Tax review.',
      'External filing or notification assistance.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
      'MEMBER_SIGNATURE',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Completion of an internal amendment process does not guarantee acceptance by an external institution where separate acceptance or notification is required.',

    plainLanguageExample:
      'Changing an ordinary contact detail may be maintenance. Changing the Trust Instrument itself is an amendment and is handled separately.',
  },

  EXTERNAL_IDENTIFICATION_ASSISTANCE: {
    term: 'External Identification / EIN-TIN Assistance',

    meaning:
      'A separately purchased assistance service for preparing or supporting an application for an external identifier where an applicable authority or provider offers such an identifier.',

    purpose:
      'To help a Member prepare the information and documentation needed for an external identification process.',

    whatTrustClubDoes: [
      'Identifies the agreed application workflow.',
      'Collects the information required for the supported process.',
      'Prepares or assists with the applicable application materials.',
      'Provides the documentation included in the purchased service.',
      'Records the resulting external reference if supplied.',
    ],

    whatMemberReceives: [
      'Application-assistance workflow.',
      'Prepared materials included in the purchased scope.',
      'Supporting-document checklist.',
      'Recorded external identifier when successfully issued and supplied.',
    ],

    memberResponsibilities: [
      'Provide accurate information.',
      'Provide required supporting documents.',
      'Sign external applications where required.',
      'Pay external fees not expressly included.',
      'Respond to requests made by the issuing authority or provider.',
    ],

    includedInBaseMembership: false,

    requiredEntitlement:
      'EXTERNAL_IDENTIFICATION_ASSISTED',

    serviceEndsWhen:
      'Trust Club has completed the assistance expressly included in the purchased scope, regardless of whether the external authority has completed its own decision process.',

    notIncluded: [
      'Guaranteed issuance.',
      'Guaranteed processing time.',
      'Authority fees unless expressly included.',
      'Tax advice merely because a tax identifier is requested.',
    ],

    optionalAddOns: [
      'Professional review.',
      'Translation.',
      'Notarization coordination.',
      'Additional external application support.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'MEMBER_SIGNATURE',
      'TAX_AUTHORITY',
      'OTHER_EXTERNAL_PARTY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Only the competent external authority or provider can decide whether to issue the requested identifier.',

    plainLanguageExample:
      'Trust Club may help prepare an EIN or other supported identifier application. The authority receiving the application decides whether and when the identifier is issued.',
  },

  DIY_BANKING_PACK: {
    term: 'DIY Banking Pack',

    meaning:
      'A standardized document and guidance package designed to help an authorized Member approach a bank or other supported financial institution independently regarding the Trust.',

    purpose:
      'To give the Member an organized starting package for an external banking inquiry without representing that a bank account has already been approved.',

    whatTrustClubDoes: [
      'Provides the applicable banking checklist.',
      'Provides an applicable Trust summary.',
      'Provides a standard Trustee authority or resolution document where supported.',
      'Provides a purpose and activity information framework.',
      'Provides guidance concerning the documents commonly requested in the supported workflow.',
    ],

    whatMemberReceives: [
      'DIY Banking Pack.',
      'Banking checklist.',
      'Applicable Trust summary.',
      'Applicable standard Trustee resolution.',
      'Purpose and activity information framework.',
    ],

    memberResponsibilities: [
      'Choose the institution to approach.',
      'Submit the application unless assisted service is separately purchased.',
      'Answer the institution truthfully and completely.',
      'Provide additional documents requested by the institution.',
      'Comply with the institution requirements applicable to the application.',
    ],

    includedInBaseMembership: true,

    requiredEntitlement:
      'BANKING_DIY_PACK',

    serviceEndsWhen:
      'The standardized DIY Banking Pack included in the service has been made available to the Member.',

    notIncluded: [
      'Bank account approval.',
      'Account opening.',
      'IBAN issuance.',
      'Payment card issuance.',
      'Credit approval.',
      'Bank onboarding decision.',
      'Waiver of bank KYC or compliance requirements.',
    ],

    optionalAddOns: [
      'Assisted Banking Activation.',
      'External identification assistance.',
      'Professional review.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Each external financial institution independently decides whether to accept an application, request additional evidence, open an account or provide a particular service.',

    plainLanguageExample:
      'You receive a structured package to help you approach a bank yourself. Receiving the package does not mean that the bank has agreed to open an account.',
  },

  ASSISTED_BANKING_ACTIVATION: {
    term: 'Assisted Banking Activation',

    meaning:
      'A separately purchased service providing structured assistance with an external banking or financial-institution onboarding process.',

    purpose:
      'To assist the Member with preparation and administration of an agreed external banking process while preserving the external institution decision-making authority.',

    whatTrustClubDoes: [
      'Defines the agreed assistance scope.',
      'Reviews the available Trust documentation for the supported application workflow.',
      'Prepares the applicable dossier components included in the purchased scope.',
      'Assists with supported information requests.',
      'Records relevant application references where available.',
    ],

    whatMemberReceives: [
      'Banking activation assistance within the purchased scope.',
      'Prepared dossier components.',
      'Application checklist.',
      'Supported administrative follow-up.',
    ],

    memberResponsibilities: [
      'Provide accurate information.',
      'Provide requested documents.',
      'Complete identity and compliance requirements.',
      'Communicate directly with the institution when required.',
      'Pay institution fees and separately quoted costs.',
    ],

    includedInBaseMembership: false,

    requiredEntitlement:
      'BANKING_ASSISTED',

    serviceEndsWhen:
      'Trust Club has completed the assistance expressly included in the purchased scope.',

    notIncluded: [
      'Guaranteed account opening.',
      'Guaranteed onboarding.',
      'Guaranteed IBAN.',
      'Guaranteed payment services.',
      'Guaranteed processing time.',
      'Circumvention of bank compliance requirements.',
    ],

    optionalAddOns: [
      'External identification assistance.',
      'Professional review.',
      'Translation or notarization coordination.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'MEMBER_SIGNATURE',
      'BANK',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'The bank or other external institution alone determines whether to approve, reject, restrict or request additional information concerning the application.',

    plainLanguageExample:
      'Trust Club can help prepare and administer the application process, but the bank makes the decision about opening and operating the account.',
  },

  PROFESSIONAL_REVIEW: {
    term: 'Professional Review',

    meaning:
      'A separately scoped review used when a matter requires or reasonably warrants specialist legal, tax, accounting, valuation or other professional consideration.',

    purpose:
      'To prevent a non-standard or specialist matter from being treated as ordinary automated administration.',

    whatTrustClubDoes: [
      'Identifies the review trigger.',
      'Collects the information relevant to the requested review.',
      'Defines or coordinates the applicable review scope.',
      'Records completion of the review workflow.',
    ],

    whatMemberReceives: [
      'The review or review coordination expressly included in the approved scope.',
      'Applicable resulting documents or findings where included.',
    ],

    memberResponsibilities: [
      'Provide complete information.',
      'Approve the separate scope and cost.',
      'Provide documents requested for the review.',
      'Understand that one professional engagement does not automatically include unrelated professional services.',
    ],

    includedInBaseMembership: false,

    requiredEntitlement:
      'PROFESSIONAL_REVIEW',

    serviceEndsWhen:
      'The separately approved professional-review scope has been completed.',

    notIncluded: [
      'Unrelated professional services.',
      'Ongoing representation unless expressly contracted.',
      'Guaranteed professional conclusion.',
      'Guaranteed external outcome.',
    ],

    optionalAddOns: [
      'Additional professional scope where separately agreed.',
    ],

    thirdPartyDependencies: [
      'MEMBER_INFORMATION',
      'ACCOUNTANT',
      'TAX_ADVISER',
      'LAWYER',
      'VALUER',
      'OTHER_EXTERNAL_PARTY',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'A professional review addresses only its approved scope and does not guarantee that a third party will accept the resulting position or documentation.',

    plainLanguageExample:
      'A complex amendment may require specialist review. The Member is shown the separate scope before that additional service begins.',
  },

  TRUST_TERMINATION: {
    term: 'Trust Termination',

    meaning:
      'A separately controlled workflow for documenting and administering the requested termination or closure of a Trust.',

    purpose:
      'To prevent Trust termination from being confused with cancellation of a Membership subscription and to ensure that closure matters are addressed deliberately.',

    whatTrustClubDoes: [
      'Receives the termination request.',
      'Provides the applicable termination checklist.',
      'Identifies internal records requiring closure or update.',
      'Provides or coordinates the documentation included in the approved termination scope.',
      'Updates the internal Trust status when the applicable internal requirements are satisfied.',
    ],

    whatMemberReceives: [
      'Termination workflow.',
      'Termination checklist.',
      'Documents included in the approved scope.',
      'Updated internal Trust status when completed.',
    ],

    memberResponsibilities: [
      'Confirm authority to request termination.',
      'Address outstanding Trust property and obligations.',
      'Provide required information and signatures.',
      'Complete external closure requirements where applicable.',
    ],

    includedInBaseMembership: false,

    requiredEntitlement:
      'PROFESSIONAL_REVIEW',

    serviceEndsWhen:
      'The internal termination work included in the separately approved scope has been completed and the applicable Trust status has been updated.',

    notIncluded: [
      'Automatic destruction of the Trust because a subscription ends.',
      'Automatic discharge of liabilities.',
      'Automatic distribution of assets.',
      'Tax closure.',
      'Bank account closure.',
      'External registry closure.',
      'Unquoted professional work.',
    ],

    optionalAddOns: [
      'Professional review.',
      'External closure assistance.',
      'Accounting or tax coordination where separately offered.',
    ],

    thirdPartyDependencies: [
      'TRUSTEE_AUTHORITY',
      'MEMBER_SIGNATURE',
    ],

    externalOutcomeNotGuaranteed: true,

    externalOutcomeExplanation:
      'Internal Trust termination documentation does not automatically complete separate bank, tax, registry, creditor or other external closure requirements.',

    plainLanguageExample:
      'Stopping the monthly Membership does not automatically terminate the Trust. Trust termination is a separate controlled process.',
  },
} as const satisfies Record<
  string,
  TrustClubPlainLanguageDefinition
>;

export type TrustClubServiceCode =
  keyof typeof TRUST_CLUB_SERVICE_CATALOG;

export function getTrustClubServiceDefinition(
  serviceCode:
    TrustClubServiceCode,
): TrustClubPlainLanguageDefinition {
  return TRUST_CLUB_SERVICE_CATALOG[
    serviceCode
  ];
}

export function getTrustClubBaseMembershipServices():
  readonly TrustClubServiceCode[] {
  return (
    Object.entries(
      TRUST_CLUB_SERVICE_CATALOG,
    ) as Array<
      [
        TrustClubServiceCode,
        TrustClubPlainLanguageDefinition,
      ]
    >
  )
    .filter(
      ([, definition]) =>
        definition.includedInBaseMembership,
    )
    .map(
      ([serviceCode]) =>
        serviceCode,
    );
}