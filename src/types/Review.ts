export interface Review {
  id: string;
  name: string;
  address: string;
  description: string;
  rating: number;
  reviewerName: string;
  userId: string;
  restaurantImage: string;
  menuImage: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  phoneNumber: string;
  createdAt: Date | string;
}
