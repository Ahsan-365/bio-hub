// --- Blood Predictor Logic ---

function predictChildBloodGroup() {
    const p1Blood = document.getElementById('parent1Blood').value;
    const p1Rh = document.getElementById('parent1Rh').value;
    const p2Blood = document.getElementById('parent2Blood').value;
    const p2Rh = document.getElementById('parent2Rh').value;
    const predictorResultsDiv = document.getElementById('bloodPredictorResults');

    predictorResultsDiv.style.display = 'block';
    predictorResultsDiv.innerHTML = '';

    if (!p1Blood || !p1Rh || !p2Blood || !p2Rh) return;

    const possibleABO = getPossibleABO(p1Blood, p2Blood);
    const possibleRh = getPossibleRh(p1Rh, p2Rh);

    let resultHTML = `<h3 style="color: var(--accent-blue);"><i class="fas fa-baby"></i> Possible Child Blood Groups</h3>`;
    resultHTML += "<div style='display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;'>";

    if (possibleABO.length === 0 || possibleRh.length === 0) {
        resultHTML += "<div style='padding: 10px; background: rgba(239, 68, 68, 0.2); color: var(--accent-red); border-radius: var(--radius-md);'>Cannot determine with given inputs.</div>";
    } else {
        possibleABO.forEach(abo => {
            possibleRh.forEach(rh => {
                const isOp = abo === 'O' && rh === '-'; // Highlight O-
                const highlightStyle = isOp ? 'border: 1px solid var(--accent-red); background: rgba(239, 68, 68, 0.2);' : 'background: rgba(255,255,255,0.05);';
                resultHTML += `<div style='padding: 10px 20px; border-radius: var(--radius-md); font-size: 1.2rem; font-weight: 700; ${highlightStyle}'>${abo}${rh}</div>`;
            });
        });
    }
    resultHTML += "</div><p style='margin-top: 15px; font-size: 0.85rem; color: var(--text-muted);'><i class='fas fa-info-circle'></i> Prediction based on standard Mendelian inheritance. Actual outcomes may vary. Consult a medical professional for genetic counseling.</p>";

    // Add visual flare
    predictorResultsDiv.style.opacity = '0';
    predictorResultsDiv.innerHTML = resultHTML;
    void predictorResultsDiv.offsetWidth;
    predictorResultsDiv.style.transition = 'opacity 0.4s ease';
    predictorResultsDiv.style.opacity = '1';
}

function getPossibleABO(parent1, parent2) {
    const phenotypes = {
        'A': ['A', 'O'],
        'B': ['B', 'O'],
        'AB': ['A', 'B'],
        'O': ['O', 'O']
    };

    const p1Alleles = phenotypes[parent1];
    const p2Alleles = phenotypes[parent2];
    const possibleCombos = new Set();

    for (let i = 0; i < p1Alleles.length; i++) {
        for (let j = 0; j < p2Alleles.length; j++) {
            const combo = p1Alleles[i] + p2Alleles[j];
            if (combo.includes('A') && combo.includes('B')) {
                possibleCombos.add('AB');
            } else if (combo.includes('A')) {
                possibleCombos.add('A');
            } else if (combo.includes('B')) {
                possibleCombos.add('B');
            } else if (combo.includes('O') && combo.length === 2) {
                possibleCombos.add('O');
            }
        }
    }
    return Array.from(possibleCombos).sort();
}

function getPossibleRh(parent1Rh, parent2Rh) {
    const p1PossibleGenotypes = parent1Rh === '+' ? ['++', '+-'] : ['--'];
    const p2PossibleGenotypes = parent2Rh === '+' ? ['++', '+-'] : ['--'];
    const possibleRhFactors = new Set();

    p1PossibleGenotypes.forEach(g1 => {
        p2PossibleGenotypes.forEach(g2 => {
            const alleles1 = [g1[0], g1[1]];
            const alleles2 = [g2[0], g2[1]];

            const combos = [
                alleles1[0] + alleles2[0],
                alleles1[0] + alleles2[1],
                alleles1[1] + alleles2[0],
                alleles1[1] + alleles2[1]
            ];

            combos.forEach(c => {
                if (c.includes('+')) { possibleRhFactors.add('+'); }
                else { possibleRhFactors.add('-'); }
            });
        });
    });
    return Array.from(possibleRhFactors).sort();
}


// --- Blood Donation Eligibility Checker ---

function checkBloodDonation() {
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const healthStatus = document.getElementById('healthStatus').value;
    const lastDonation = document.getElementById('lastDonation').value;
    const donationResultDiv = document.getElementById('donationResult');

    donationResultDiv.style.display = 'block';
    donationResultDiv.innerHTML = '';

    let eligible = true;
    let reasons = [];

    if (isNaN(age) || age < 17 || age > 65) {
        eligible = false;
        reasons.push("Age must typically be between 17 and 65 years.");
    }
    if (isNaN(weight) || weight < 50) {
        eligible = false;
        reasons.push("Weight must be at least 50 kg (approx. 110 lbs).");
    }
    if (healthStatus === 'yes') {
        eligible = false;
        reasons.push("Major health conditions often disqualify donors.");
    }

    if (lastDonation === 'lessThan3') {
        eligible = false;
        reasons.push("You must wait at least 3 months (approx. 12 weeks) since your last donation.");
    }

    let alertHtml = '';
    if (eligible) {
        alertHtml = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-green); padding: 20px; border-radius: var(--radius-md);">
                <h3 style="color: var(--accent-green); display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i> You are likely eligible!
                </h3>
                <p style="margin-top: 10px; color: var(--text-muted);">Please consult your local blood bank for definitive eligibility.</p>
            </div>
        `;
    } else {
        let reasonList = `<ul>${reasons.map(r => `<li style="margin-bottom: 5px;">${r}</li>`).join('')}</ul>`;
        alertHtml = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--accent-red); padding: 20px; border-radius: var(--radius-md);">
                <h3 style="color: var(--accent-red); display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-times-circle" style="font-size: 1.5rem;"></i> You may not be eligible.
                </h3>
                <div style="margin-top: 15px; color: var(--text-main);">
                    <strong>Reasons for potential ineligibility:</strong>
                    <div style="margin-top: 5px; color: var(--text-muted); padding-left: 20px;">${reasonList}</div>
                </div>
            </div>
        `;
    }

    donationResultDiv.style.opacity = '0';
    donationResultDiv.innerHTML = alertHtml;
    void donationResultDiv.offsetWidth;
    donationResultDiv.style.transition = 'opacity 0.4s ease';
    donationResultDiv.style.opacity = '1';
}
