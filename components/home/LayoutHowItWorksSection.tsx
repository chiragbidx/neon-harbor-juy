import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomeContent } from "@/content/home";
import { Sparkles, BookOpen, Send } from "lucide-react";

const howItWorks = [
  {
    step: 1,
    label: "Import Your Contacts",
    description:
      "Upload your existing contacts or add new subscribers to build your target audience in seconds.",
    icon: BookOpen,
  },
  {
    step: 2,
    label: "Design a Campaign",
    description:
      "Write stunning emails using our intuitive editor, and select the audience you want to reach—no clutter or confusion.",
    icon: Sparkles,
  },
  {
    step: 3,
    label: "Send & Analyze",
    description:
      "Send instantly or schedule for later. Track opens and clicks as MailSpark measures your campaign’s reach and engagement.",
    icon: Send,
  },
];

export const LayoutHowItWorksSection = () => {
  return (
    <section
      id="how-mailSpark-works"
      className="container py-24 sm:py-32 flex flex-col items-center"
    >
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        How MailSpark Works
      </h2>
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Simple steps to email marketing success
      </h2>
      <p className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-12">
        Get started in minutes—MailSpark lets you reach, engage, and grow your audience with effortless campaigns and actionable analytics.
      </p>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
        {howItWorks.map(({ step, label, description, icon: Icon }) => (
          <Card
            key={label}
            className="w-full max-w-xs md:max-w-sm flex flex-col items-center py-8"
          >
            <CardHeader className="flex flex-col items-center">
              <span className="text-4xl mb-2 text-primary">{step}</span>
              <Icon className="text-primary mb-4" size={36} />
              <CardTitle className="text-center">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};