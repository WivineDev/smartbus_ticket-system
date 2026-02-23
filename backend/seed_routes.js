const db = require('./src/config/database');

const sampleRoutes = [
    { departure_location: 'Kigali', destination: 'Musanze', distance: 95.0, estimated_time: '02:30:00', base_price: 2500 },
    { departure_location: 'Kigali', destination: 'Rubavu', distance: 155.0, estimated_time: '03:30:00', base_price: 3500 },
    { departure_location: 'Kigali', destination: 'Huye', distance: 130.0, estimated_time: '03:00:00', base_price: 3000 },
    { departure_location: 'Kigali', destination: 'Rusizi', distance: 220.0, estimated_time: '05:30:00', base_price: 6000 },
    { departure_location: 'Kigali', destination: 'Nyagatare', distance: 160.0, estimated_time: '03:45:00', base_price: 4000 },
    { departure_location: 'Kigali', destination: 'Kayonza', distance: 75.0, estimated_time: '01:45:00', base_price: 1500 },
    { departure_location: 'Musanze', destination: 'Kigali', distance: 95.0, estimated_time: '02:15:00', base_price: 2500 },
    { departure_location: 'Rubavu', destination: 'Kigali', distance: 155.0, estimated_time: '03:45:00', base_price: 3500 },
    { departure_location: 'Huye', destination: 'Kigali', distance: 130.0, estimated_time: '02:45:00', base_price: 3000 },
    { departure_location: 'Rusizi', destination: 'Kigali', distance: 220.0, estimated_time: '05:45:00', base_price: 6000 },
    { departure_location: 'Musanze', destination: 'Rubavu', distance: 65.0, estimated_time: '01:15:00', base_price: 1500 },
    { departure_location: 'Rubavu', destination: 'Musanze', distance: 65.0, estimated_time: '01:20:00', base_price: 1500 }
];

const seedRoutes = async () => {
    try {
        console.log('🌱 Seeding expanded Rwandan routes...');

        // Clear old/incorrectly formatted routes first to ensure schema compliance
        // Note: distance and estimated_time formats changed
        await db.execute('DELETE FROM routes');
        console.log('🗑️  Old routes cleared.');

        for (const route of sampleRoutes) {
            await db.execute(
                `INSERT INTO routes (departure_location, destination, distance, estimated_time, base_price, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
                [route.departure_location, route.destination, route.distance, route.estimated_time, route.base_price]
            );
            console.log(`✅ Added: ${route.departure_location} -> ${route.destination}`);
        }

        console.log('🚀 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedRoutes();
