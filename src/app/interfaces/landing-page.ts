//Interface para el landing page
export interface LandingPageContent {
  id: number;
  key: string;
  content: {
    email: string;
    vision: string;
    address: string;
    mission: string;
    phone_number: string;
    social_media_links: {
      facebook: string;
      instagram: string;
    };
    'sponsored children': {
      title: string;
      amount: number;
      subtitle: string;
    };
    years_of_experience: {
      title: string;
      amount: number;
      subtitle: string;
    };
    municipalities_influenced: {
      title: string;
      amount: number;
      subtitle: string;
    };
  };
}
