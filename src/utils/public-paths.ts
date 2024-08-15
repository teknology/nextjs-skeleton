
export const uploadsPath = "/uploads/";

export const profileAvatarUrl = (userid: string, imageName: string) => {

    if (imageName) {
        //  console.log(`${uploadsPath}/${userid}/profile/${imageName}`);
        return `${uploadsPath}/${userid}/profile/${imageName}`;

    } else {
        return '';
    }



}