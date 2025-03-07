import mqtt from 'mqtt';

const publishChange = (topic, message) => {
  const client = mqtt.connect('mqtt://localhost:1883');
  client.on('connect', () => {
    client.publish(topic, JSON.stringify(message), () => {
      client.end();
    });
  });
};

export { publishChange };