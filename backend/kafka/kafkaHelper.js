const { Kafka }  = require('kafkajs');

class KafkaHelper {

    constructor() {
        const kafka = new Kafka({
            clientId: 'nodejs-backend',
            brokers: ['localhost:9092']
        });
        
        this.producer = kafka.producer();
        this.connected = false;
    }

    async connect() {
        if (!this.connected) {
            await this.producer.connect();
            this.connected = true;
            console.log('Kafka producer connected');
        }
    }

    async sendEvent(userId, ingredient, action) {
        await this.producer.send({
            topic: 'testing-kafka1',
            messages: [{
                value: JSON.stringify({
                    userId,
                    ingredient: ingredient.toLowerCase(),
                    action
                })
            }]
        });
        
        console.log(`Event sent: ${action} - ${ingredient} for user ${userId}`);
    }

    async disconnect() {
        if (this.connected) {
            await this.producer.disconnect();
            this.connected = false;
        }
    }
}

module.exports = KafkaHelper;