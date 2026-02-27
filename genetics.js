// --- Punnett Square Logic ---

function generatePunnettSquare() {
    const p1Input = document.getElementById("p1Punnett");
    const p2Input = document.getElementById("p2Punnett");

    // Safety check if elements don't exist
    if (!p1Input || !p2Input) return;

    const p1 = p1Input.value.trim();
    const p2 = p2Input.value.trim();
    const resultsDiv = document.getElementById("punnettResults");

    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = ''; // Clear previous results

    if (p1.length !== 2 || p2.length !== 2 || !/^[a-zA-Z]{2}$/.test(p1) || !/^[a-zA-Z]{2}$/.test(p2)) {
        resultsDiv.innerHTML = '<p style="color: var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> Please enter valid 2-letter genotypes for both parents (e.g., Aa, AA, bb). Only letters allowed.</p>';
        return;
    }

    const alleles1 = [p1.charAt(0), p1.charAt(1)];
    const alleles2 = [p2.charAt(0), p2.charAt(1)];

    let tableHTML = `<h3><i class="fas fa-table"></i> Genotype Outcomes</h3>`;
    tableHTML += `<div class="table-responsive"><table><tr><th></th><th>${alleles2[0]}</th><th>${alleles2[1]}</th></tr>`;

    const results = {}; // To store genotype counts

    for (let i = 0; i < 2; i++) {
        tableHTML += `<tr><th>${alleles1[i]}</th>`;
        for (let j = 0; j < 2; j++) {
            let combo = alleles1[i] + alleles2[j];
            combo = combo.split('').sort((a, b) => {
                // Sort to ensure dominant allele (uppercase) comes first, then alphabetical
                if (a.toUpperCase() === b.toUpperCase()) return a.localeCompare(b);
                return a.charCodeAt(0) - b.charCodeAt(0);
            }).join('');

            results[combo] = (results[combo] || 0) + 1;
            tableHTML += `<td><strong>${combo}</strong></td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table></div>';

    let summaryHTML = '<h3><i class="fas fa-chart-pie"></i> Genotype Ratio:</h3><ul style="list-style-position: inside; margin-top: 10px; color: var(--text-muted);">';
    for (const [genotype, count] of Object.entries(results)) {
        const percentage = (count / 4 * 100).toFixed(0);
        summaryHTML += `<li style='margin-bottom: 8px;'><strong style='color: var(--text-main);'>${genotype}</strong>: ${count}/4 (${percentage}%)</li>`;
    }
    summaryHTML += "</ul>";

    // Add some animation to display
    resultsDiv.style.opacity = '0';
    resultsDiv.innerHTML = tableHTML + summaryHTML;

    // Trigger reflow
    void resultsDiv.offsetWidth;
    resultsDiv.style.transition = 'opacity 0.5s ease';
    resultsDiv.style.opacity = '1';
}

// --- DNA Tools Logic ---

const codonTable = {
    'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
    'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
    'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met',
    'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
    'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
    'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
    'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
    'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
    'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'STOP', 'UAG': 'STOP',
    'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
    'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
    'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
    'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'STOP', 'UGG': 'Trp',
    'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
    'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
    'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly'
};

function processDNA() {
    const rawInput = document.getElementById('dnaSequence').value.toUpperCase().replace(/\s+/g, '');
    const resultsDiv = document.getElementById('dnaResults');

    // Validate DNA characters
    if (!/^[ATCG]+$/.test(rawInput)) {
        alert("Invalid sequence! Please use only A, T, C, and G.");
        return;
    }

    // 1. Complementary DNA
    const compDNA = rawInput.split('').map(char => {
        if (char === 'A') return 'T';
        if (char === 'T') return 'A';
        if (char === 'C') return 'G';
        if (char === 'G') return 'C';
    }).join('');

    // 2. mRNA Transcription (from the coding 5'-3' strand, mRNA is same but T -> U)
    const mRNA = rawInput.replace(/T/g, 'U');

    // 3. Protein Translation
    let protein = [];
    for (let i = 0; i < mRNA.length; i += 3) {
        const codon = mRNA.substring(i, i + 3);
        if (codon.length === 3) {
            protein.push(codonTable[codon] || '?');
            if (codonTable[codon] === 'STOP') break; // Halt at Stop Codon
        } else {
            // Dangling base
            protein.push(`[${codon}]`);
        }
    }

    document.getElementById('resDNA').innerText = rawInput;
    document.getElementById('resComp').innerText = compDNA;
    document.getElementById('resMRNA').innerText = mRNA;
    document.getElementById('resProtein').innerText = protein.join(' - ');

    resultsDiv.style.display = 'block';
    resultsDiv.style.opacity = '0';
    void resultsDiv.offsetWidth;
    resultsDiv.style.transition = 'opacity 0.4s ease';
    resultsDiv.style.opacity = '1';
}
