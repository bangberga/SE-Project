import axios from "axios";

const validate = async (number: string, country: string) => {
  try {
    const {
      data: { isValidNumber },
    }: { data: { isValidNumber: boolean } } = await axios.get(
      process.env.X_RAPID_API as string,
      {
        headers: {
          "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.X_RAPID_API_HOST,
        },
        params: { number, country },
      }
    );
    return isValidNumber;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default validate;
