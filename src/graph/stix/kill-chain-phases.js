const kill_chain_phases = [
    "reconnaissance",
    "weaponization",
    "delivery",
    "exploitation",
    "installation",
    "command_and_contol",
    "actions_on_objectives"
];

createKillChainForm = evt => {
    killChainSubmitEvent = s_evt => {
        s_evt.preventDefault();
        const phaseNameField = document.getElementById("phase_name");
        const phaseName = phaseNameField.value;
        var isDuplicated = false;
        document.querySelectorAll("#kill_chain_phases .entry-content").forEach(e=>{
            const jsonData = JSON.parse(e.textContent);
            if (jsonData['phase_name'] === phaseName) {
                isDuplicated = true;
            }
        }); 

        if (isDuplicated) {
            alert("This phase was already added");
        } else {
            const entry = {
                "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                "phase_name": phaseName
            }

            FormHandler.addSubFormEntry("kill_chain_phases", phaseName, JSON.stringify(entry));
            s_evt.target.closest(".popup-container").remove();
        }
        return false;
    }
    sFormHandler = new FormHandler("Add Kill Chain Phase");
    sFormHandler.setSubmitEventListener(killChainSubmitEvent);
    sFormHandler.addFormField("hidden", "Kill Chain Name", "kill_chain_name", "lockheed-martin-cyber-kill-chain", true);
    sFormHandler.addFormField("select", "Phase Name", "phase_name", "", true, kill_chain_phases);
}

