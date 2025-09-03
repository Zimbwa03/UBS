import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Grace M.",
    role: "Parent",
    message: "Thanks to Ubalo Sungano's support, my daughter now has the school supplies she needs. This organization truly cares about our children's future.",
    color: "primary"
  },
  {
    name: "Teacher Joseph",
    role: "Local Educator",
    message: "The impact on our students has been remarkable. They're more engaged and excited about learning since receiving this support.",
    color: "secondary"
  },
  {
    name: "Community Leader",
    role: "Guruve District",
    message: "Ubalo Sungano's dedication to our community's children gives us hope. Their consistent outreach programs are changing lives.",
    color: "accent"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
            Voices of Hope
          </h2>
          <p className="text-xl text-muted-foreground">
            Hear from those whose lives have been touched
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="rounded-2xl p-6 shadow-lg"
              data-testid={`testimonial-card-${index}`}
            >
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${testimonial.color}/10 rounded-full flex items-center justify-center mr-4`}>
                    <Quote className={`w-5 h-5 text-${testimonial.color}`} />
                  </div>
                  <div>
                    <div className="font-bold" data-testid={`testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic" data-testid={`testimonial-message-${index}`}>
                  "{testimonial.message}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
