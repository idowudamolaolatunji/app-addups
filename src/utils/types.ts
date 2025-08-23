


export type DurationDetailsType = {
    durationInHours: string;
    amountInFigure: string;
    priceInFigure: string;
    duration: string;
    amount: number;
    points: number;
}


export type LocationType = {
    country: string;
    region: string;
}

export type ImageType = {
    url: string;
    public_id: string;
}

export type ListingType = {
    _id?: string;
    displayName: string;
    link: string;
    location: LocationType;
    description: string;
    displayImage: ImageType;
    targetGender: string;
    displayDurationInHours: number;
    extraDisplayDurationInHours?: number;
    lister: {
        gender: string;
        country: string;
        region: string;
    };
    dateTimeToExpire: Date | string | any;
    status: string;
}