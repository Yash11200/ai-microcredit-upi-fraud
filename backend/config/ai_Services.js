import axios from "axios";

export const predictCreditRisk = async ({
    person_age,
    person_income,
    loan_amnt,
    loan_grade,
    person_emp_length
}) => {
    try {
        const res = await axios.post(`${process.env.AI_BASE_URL}/predict_credit_risk`, {
            person_age: person_age,
            person_income: person_income,
            loan_amnt: loan_amnt,
            loan_grade: loan_grade,
            person_emp_length: person_emp_length
        });
        return res.data;
    } catch (error) {
        console.error("Error calling AI service:", error);
        throw error;
    }
};

export const predictFraud = async ({
    type,
    amount,
    oldbalanceOrg,
    newbalanceOrig,
    oldbalanceDest,
    newbalanceDest
}) => {
    try {
        const res = await axios.post(`${process.env.AI_BASE_URL}/predict_fraud`, {
            type: type,
            amount: amount,
            oldbalanceOrg: oldbalanceOrg,
            newbalanceOrig: newbalanceOrig,
            oldbalanceDest: oldbalanceDest,
            newbalanceDest: newbalanceDest
        });
        return res.data;
    } catch (error) {
        console.error("Error calling AI service:", error);
        throw error;
    }
};