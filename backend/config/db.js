import mongoose from 'mongoose';
import dns from 'node:dns';

const connectDB = async () => {
    const configuredDnsServers = process.env.MONGODB_DNS_SERVERS;

    if (configuredDnsServers !== undefined) {
        const dnsServers = configuredDnsServers
            .split(',')
            .map((server) => server.trim())
            .filter(Boolean);

        if (dnsServers.length === 0) {
            throw new Error('MONGODB_DNS_SERVERS must contain at least one DNS server address');
        }

        dns.setServers(dnsServers);
    }

    try{
        const conn = await mongoose.connect(`${process.env.MONGO_URI}EVENTORA`);
        console.log("Connection Successful!");
    } catch(error){
        console.error("Connection failed", error.message);
        process.exit(1);
    }
}

export default connectDB;