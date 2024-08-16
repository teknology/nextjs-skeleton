
export const uploadsPath = "/uploads/";

export const createProfileImagePath = (userid: string, imageName: string) => {

    if (imageName && userid) {
        //  console.log(`${uploadsPath}/${userid}/profile/${imageName}`);
        return `${uploadsPath}/${userid}/profile/${imageName}`;

    } else {
        throw new Error('Image name or User ID is missing');
    }



}
