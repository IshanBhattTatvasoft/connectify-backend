export interface CreateCommunityResponseDto {
    name: string;
    subTitle: string;
    description: string;
    category: string;
    owner: {
        user_id: string;
        username: string;
    }
    created_at: Date;
}