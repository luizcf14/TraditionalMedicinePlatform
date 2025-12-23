


async function testCreateAppointment() {
    try {
        // First get a patient ID (using the seeded one)
        // We know the seeded patient CNS is 700000000000001
        // But we need the UUID. Let's assume we can fetch it or just search.
        const searchRes = await fetch('http://localhost:3001/api/patients?q=Tukano');
        const searchData = await searchRes.json();

        if (!searchData.patients || searchData.patients.length === 0) {
            console.error('No patient found to test with.');
            return;
        }

        const patientId = searchData.patients[0].id;
        console.log('Testing with patientId:', patientId);

        const res = await fetch('http://localhost:3001/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: patientId,
                reason: 'Test Appointment',
                status: 'In Progress'
            })
        });

        const data = await res.json();
        console.log('Create Appointment Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCreateAppointment();
