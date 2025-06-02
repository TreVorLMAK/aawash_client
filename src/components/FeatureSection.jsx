import { Bed, ShieldCheck, MapPin, Gauge } from "lucide-react";

const features = [
  {
    icon: <Bed size={32} />,
    title: "Room, Flat & Home Listings",
    desc: "Browse verified long-term rental options that match your lifestyle.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Chat & Booking",
    desc: "Message landlords securely. Book directly, no middleman.",
  },
  {
    icon: <MapPin size={32} />,
    title: "Location-Based Discovery",
    desc: "Find rooms near you using map-based search & filters.",
  },
  {
    icon: <Gauge size={32} />,
    title: "Landlord Dashboard",
    desc: "Manage listings, bookings & track responses with ease.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Aawash?</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-xl transition">
              <div className="mb-4 text-indigo-600">{feat.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
