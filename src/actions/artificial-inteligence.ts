export default async function checkImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    const response = await fetch('/api/check-image', {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to check image');
    }
}