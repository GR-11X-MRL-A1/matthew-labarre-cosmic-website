// SMS & Call Reporting Script for iOS
// Scriptable App - Save as .js file

// Import Scriptable modules
const Console = importModule('console')
const Message = importModule('message')
const Contacts = importModule('contacts')
const Calendar = importModule('calendar')

class EmergencyReporter {
  constructor() {
    this.agencyContacts = {
      broomeSheriff: {
        name: "Broome County Sheriff",
        phone: "6077781911",
        nonEmergency: true
      },
      ftcIdentityTheft: {
        name: "FTC Identity Theft",
        website: "IdentityTheft.gov"
      }
    }
    
    this.legalReferences = {
      nyPenalLaw: "NY Penal Law §190.80",
      identityTheft: "Identity Theft and Assumption Deterrence Act"
    }
  }

  // Generate SMS report template
  generateSMSReport() {
    const reporter = "Matthew Russell LaBarre"
    const date = new Date().toLocaleDateString('en-US')
    const time = new Date().toLocaleTimeString('en-US')
    
    const templates = {
      initialReport: `
IDENTITY THEFT REPORT - ${date} ${time}
Reporter: ${reporter}
FTC Report: Filed
Incident: Unauthorized bank access, password changes, stolen funds
Legal Basis: ${this.legalReferences.nyPenalLaw}
Status: ACTIVE CRIMINAL INVESTIGATION
Evidence: Threatening messages, bank records available
      `,
      
      followUp: `
FOLLOW UP - Identity Theft Case
Reporter: ${reporter}
Date: ${date}
Previous Report: [INSERT DATE]
Additional Evidence: [DESCRIBE NEW EVIDENCE]
Urgency: REQUIRES IMMEDIATE ACTION
      `,
      
      escalation: `
ESCALATION - Refusal to Process Report
Reporter: ${reporter}
Date: ${date}
Issue: Law enforcement refusal to take identity theft report
Request: Supervisor contact and badge number documentation
Legal Requirement: NY Penal Law mandates identity theft reporting
      `
    }
    
    return templates
  }

  // Create contact for quick dialing
  async createEmergencyContacts() {
    try {
      const sheriffContact = new Contacts()
      sheriffContact.givenName = "Broome County Sheriff"
      sheriffContact.phoneNumbers = [{
        label: "non-emergency",
        value: this.agencyContacts.broomeSheriff.phone
      }]
      sheriffContact.notes = "Identity theft reporting - Non-emergency line"
      
      await sheriffContact.add()
      Console.log("Emergency contact created successfully")
    } catch (error) {
      Console.log("Error creating contact: " + error)
    }
  }

  // Generate call script with prompts
  generateCallScript() {
    const script = {
      introduction: "Hello, I'm calling to report identity theft and grand larceny under New York Penal Law.",
      identification: "My name is Matthew Russell LaBarre.",
      incident: "Someone has accessed my bank accounts without authorization, changed my passwords, and stolen funds.",
      evidence: "I have an FTC identity theft report filed and evidence of threatening messages.",
      request: "I need to file a police report for my financial institutions and the District Attorney's office.",
      legalBasis: "This constitutes identity theft under NY Penal Law §190.80 and grand larceny.",
      
      escalation: {
        ifResisted: "If they resist:",
        statement: "I understand you may see this as civil, but under NY Penal Law, identity theft is a criminal offense.",
        demand: "I need a police report. If you're unable to take this report, I need your name and badge number for my records and to contact the District Attorney directly."
      }
    }
    
    return script
  }

  // Create calendar event for follow-up
  async createFollowUpReminder() {
    try {
      const calendar = await Calendar.forEvents()
      const event = new Calendar.Event()
      
      event.title = "Follow Up: Identity Theft Report"
      event.notes = "Follow up with Broome County Sheriff on identity theft case status"
      event.startDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      event.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000) // 30 min later
      
      calendar.addEvent(event)
      Console.log("Follow-up reminder created")
    } catch (error) {
      Console.log("Error creating calendar event: " + error)
    }
  }

  // Quick action menu
  async showQuickActions() {
    const actions = [
      "Generate SMS Report",
      "Show Call Script", 
      "Create Emergency Contact",
      "Set Follow-up Reminder",
      "View Legal References"
    ]
    
    const alert = new Alert()
    alert.title = "Emergency Reporting Tools"
    alert.message = "Select an action for identity theft reporting"
    
    actions.forEach(action => alert.addAction(action))
    
    const response = await alert.present()
    
    switch(response) {
      case 0: // SMS Report
        await this.showSMSTemplates()
        break
      case 1: // Call Script
        await this.showCallScript()
        break
      case 2: // Emergency Contact
        await this.createEmergencyContacts()
        break
      case 3: // Follow-up
        await this.createFollowUpReminder()
        break
      case 4: // Legal References
        await this.showLegalReferences()
        break
    }
  }

  async showSMSTemplates() {
    const templates = this.generateSMSReport()
    const alert = new Alert()
    alert.title = "SMS Report Templates"
    alert.message = "Copy template for law enforcement reporting"
    
    Object.keys(templates).forEach(key => {
      alert.addAction(key)
    })
    
    const response = await alert.present()
    const selectedTemplate = Object.values(templates)[response]
    
    // Copy to clipboard
    Pasteboard.copyString(selectedTemplate)
    
    const confirm = new Alert()
    confirm.title = "Template Copied"
    confirm.message = "SMS template copied to clipboard. Ready to paste in Messages."
    confirm.addAction("OK")
    await confirm.present()
  }

  async showCallScript() {
    const script = this.generateCallScript()
    const alert = new Alert()
    alert.title = "Call Script - Broome County Sheriff"
    alert.message = JSON.stringify(script, null, 2)
    alert.addAction("OK")
    await alert.present()
  }

  async showLegalReferences() {
    const alert = new Alert()
    alert.title = "Legal References"
    alert.message = `
NY Penal Law §190.80 - Identity Theft
NY Penal Law §155.30 - Grand Larceny
Fair Housing Act - Support Animal Protections
Americans with Disabilities Act
    `
    alert.addAction("OK")
    await alert.present()
  }
}

// Instantiate and run
const reporter = new EmergencyReporter()

// Check if we're in the app or widget
if (config.runsInApp) {
  reporter.showQuickActions()
} else {
  // Widget implementation
  const widget = new ListWidget()
  widget.addText("🆘 Emergency Reporter")
  widget.addText("Tap to open tools")
  Script.setWidget(widget)
}

// Export for module use
module.exports = EmergencyReporter