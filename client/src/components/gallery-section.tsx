import { Card, CardContent } from "@/components/ui/card";

const galleryItems = [
  {
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    title: "Educational Support",
    description: "Providing school supplies and learning materials to help children succeed in their education."
  },
  {
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    title: "Nutritional Care",
    description: "Ensuring children receive nutritious meals to support their growth and development."
  },
  {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    title: "Healthcare Access",
    description: "Providing essential healthcare services and medical support to keep children healthy."
  }
];

export default function GallerySection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-gallery-title">
            Making a Difference
          </h2>
          <p className="text-xl text-muted-foreground">
            See the impact of our previous outreach efforts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Card 
              key={index} 
              className="rounded-2xl overflow-hidden shadow-lg donation-card"
              data-testid={`gallery-card-${index}`}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
                data-testid={`gallery-image-${index}`}
              />
              <CardContent className="p-6">
                <h3 className="font-bold mb-2" data-testid={`gallery-title-${index}`}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm" data-testid={`gallery-description-${index}`}>
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
