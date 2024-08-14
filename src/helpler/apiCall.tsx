import axios from "axios";

export const apiCall = async (id: any) => {
  const apiKey = "AIzaSyCH6RZOwPTkVce0Ba33Y30vJrYfraS_dzg"; // Replace with your API key
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`;

  try {
    const response = await axios.get(apiUrl);
    console.log(
      "res",
      response?.data?.items[0]?.snippet?.thumbnails?.standard?.url
    );

    return {
      thumbnail: response?.data?.items[0]?.snippet?.thumbnails?.standard?.url,
      title: response?.data?.items[0]?.snippet?.title,
    };
  } catch (error) {
    console.error("Error fetching the thumbnail:", error);
  }
};
