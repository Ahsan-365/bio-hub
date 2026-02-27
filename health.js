// --- BMI Calculator ---

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const heightCm = parseFloat(document.getElementById('bmiHeight').value);
    const bmiResultDiv = document.getElementById('bmiResult');

    bmiResultDiv.style.display = 'block';
    bmiResultDiv.innerHTML = '';

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) return;

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    let category = '';
    let color = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3b82f6'; // Blue
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal weight';
        color = '#10b981'; // Green
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = 'Overweight';
        color = '#f59e0b'; // Orange
    } else {
        category = 'Obesity';
        color = '#ef4444'; // Red
    }

    let alertHtml = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700; color: ${color}; filter: drop-shadow(0 0 10px ${color}40);">${bmi.toFixed(1)}</div>
            <div style="font-size: 1.2rem; margin-top: 5px; color: var(--text-main);">Category: <strong style="color: ${color};">${category}</strong></div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${Math.min((bmi / 40) * 100, 100)}%; background: ${color}; transition: width 1s ease-out;"></div>
            </div>
        </div>
    `;

    bmiResultDiv.style.opacity = '0';
    bmiResultDiv.innerHTML = alertHtml;
    void bmiResultDiv.offsetWidth;
    bmiResultDiv.style.transition = 'opacity 0.4s ease';
    bmiResultDiv.style.opacity = '1';
}

// --- BMR & TDEE Calculator ---

function calculateBMRAndTDEE() {
    const weight = parseFloat(document.getElementById('bmrWeight').value);
    const heightCm = parseFloat(document.getElementById('bmrHeight').value);
    const age = parseInt(document.getElementById('bmrAge').value);
    const gender = document.getElementById('bmrGender').value;
    const activityLevel = parseFloat(document.getElementById('activityLevel').value);
    const bmrResultDiv = document.getElementById('bmrResult');

    bmrResultDiv.style.display = 'block';
    bmrResultDiv.innerHTML = '';

    if (isNaN(weight) || isNaN(heightCm) || isNaN(age) || weight <= 0 || heightCm <= 0 || age <= 0) return;

    let bmr;
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
    }

    const tdee = bmr * activityLevel;

    let alertHtml = `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 15px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #f59e0b; margin-bottom: 5px;"><i class="fas fa-bed"></i> BMR (Basal Metabolic Rate)</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Calories needed at rest.</p>
                </div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${bmr.toFixed(0)} <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">kcal</span></div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 15px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: var(--accent-green); margin-bottom: 5px;"><i class="fas fa-person-running"></i> TDEE (Total Expenditure)</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Calories needed to maintain weight.</p>
                </div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">${tdee.toFixed(0)} <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">kcal</span></div>
            </div>
        </div>
    `;

    bmrResultDiv.style.opacity = '0';
    bmrResultDiv.innerHTML = alertHtml;
    void bmrResultDiv.offsetWidth;
    bmrResultDiv.style.transition = 'opacity 0.4s ease';
    bmrResultDiv.style.opacity = '1';
}

// --- Hydration Calculator ---
function calculateHydration() {
    const weight = parseFloat(document.getElementById('fluidWeight').value);
    const exercise = parseFloat(document.getElementById('workoutMinutes').value);
    const climate = document.getElementById('climate').value;
    const resultDiv = document.getElementById('hydrationResult');

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    if (isNaN(weight) || weight <= 0) return;

    // Base: 35ml per kg of body weight
    let intakeMl = weight * 35;

    // Exercise: roughly 350ml per 30 minutes
    if (!isNaN(exercise) && exercise > 0) {
        intakeMl += (exercise / 30) * 350;
    }

    // Climate addition: hot climate adds roughly 500ml
    if (climate === 'hot') {
        intakeMl += 500;
    }

    const intakeLiters = (intakeMl / 1000).toFixed(1);
    const cups = (intakeMl / 240).toFixed(0);

    let html = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 15px;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #0284c7); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);">
                <i class="fas fa-glass-water" style="font-size: 2.5rem; color: #fff;"></i>
            </div>
            <div>
                <h3 style="color: #0ea5e9; margin-bottom: 5px;">Daily Target</h3>
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main);">${intakeLiters} <span style="font-size: 1.2rem; font-weight: 400; color: var(--text-muted);">Liters</span></div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">Approximately <strong>${cups}</strong> standard glasses (8oz) per day.</p>
            </div>
        </div>
    `;

    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = html;
    void resultDiv.offsetWidth;
    resultDiv.style.transition = 'opacity 0.4s ease';
    resultDiv.style.opacity = '1';
}
