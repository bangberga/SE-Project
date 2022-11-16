import axios from "axios";

const validate = async (number: string, country: string) => {
  try {
    const {
      data: { isValidNumber },
    }: { data: { isValidNumber: boolean } } = await axios.get(
      "https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp",
      {
        headers: {
          "X-RapidAPI-Key":
            "d76518b774msh84131b061390fc6p1581e4jsn976815d3f8e6",
          "X-RapidAPI-Host": "phonenumbervalidatefree.p.rapidapi.com",
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
