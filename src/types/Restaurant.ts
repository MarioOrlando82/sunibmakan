export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  description: string;
  rating: number;
  restaurantImage?: string;
  menuImage?: string;
  reviewerName?: string;
  reviewerUid?: string;
}
