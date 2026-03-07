const validation = (data, method) => {
    if(method === "POST") {
        if (!data["name"] || !data["age"] || !data["gender"]) {
            throw new Error("Invalid data");
        }
    }
    if (data["gender"] !== "male" && data["gender"] !== "female") {
        throw new Error("Invalid gender");
    }
    if (data["age"] < 18) {
        throw new Error("You must be over 18 year old!");
    }
};


exports.validation = validation;
