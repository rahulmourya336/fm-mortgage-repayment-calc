import "./reset.css";
import "./App.css";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface IMortgage {
  amount: number | undefined;
  term: number | undefined;
  rate: number | undefined;
  type: string | undefined;
}

interface IResult {
  emi: string | undefined;
  total: string | undefined;
}

enum RT {
  prePayment = "pp",
  interestOnly = "io",
}

type FormFields = "amount" | "rate" | "term" | "type";

function App() {
  const [mortgage, setMortgage] = useState<IMortgage>({
    amount: undefined,
    rate: undefined,
    term: undefined,
    type: undefined,
  });

  const [result, setResult] = useState<IResult>({
    emi: undefined,
    total: undefined,
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Record<FormFields, string>>();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as FormFields, value); // Set the value in react-hook-form
    setMortgage((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePayment = () => {
    if (mortgage.type === RT.prePayment) {
      calculateLoanRepayment(mortgage.amount!, mortgage.rate!, mortgage.term!);
    } else {
      calculateInterestOnlyPayment(
        mortgage.amount!,
        mortgage.rate!,
        mortgage.term!
      );
    }
  };

  function calculateLoanRepayment(
    principal: number,
    annualInterestRate: number,
    years: number
  ) {
    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;

    // Total number of payments (months)
    const totalPayments = years * 12;

    // Monthly payment calculation using the amortization formula
    const monthlyPayment =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    // Total repayment is the monthly payment multiplied by the number of months
    const totalRepayment = monthlyPayment * totalPayments;

    const _monthlyPayment = new Intl.NumberFormat("en-US").format(
      parseFloat(monthlyPayment.toFixed(2))
    );
    const _totalRepayment = new Intl.NumberFormat("en-US").format(
      parseFloat(totalRepayment.toFixed(2))
    );
    setResult(() => ({ emi: _monthlyPayment, total: _totalRepayment }));
  }

  function calculateInterestOnlyPayment(
    principal: number,
    annualInterestRate: number,
    years: number
  ) {
    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;

    // Calculate the interest-only monthly payment
    const monthlyPayment = principal * monthlyInterestRate;

    // Calculate the total payment over the term (years)
    const totalPayments = years * 12; // Total number of months
    const totalPayment = monthlyPayment * totalPayments;

    const _monthlyPayment = new Intl.NumberFormat("en-US").format(
      parseFloat(monthlyPayment.toFixed(2))
    );
    const _totalPayment = new Intl.NumberFormat("en-US").format(
      parseFloat(totalPayment.toFixed(2))
    );

    setResult(() => ({ emi: _monthlyPayment, total: _totalPayment }));
  }

  const resetForm = () => {
    reset();
    setResult(() => ({ emi: undefined, total: undefined }));
  };

  return (
    <>
      <main>
        <div className="wrapper">
          <div className="input">
            <div className="heading">
              <div className="title">Mortgage Calculator</div>
              <div className="clear">
                <button className="text-button" onClick={resetForm}>
                  Clear All
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(calculatePayment)}>
              <div className="form">
                <div className="form-group">
                  <label htmlFor="amount">Mortgage Amount</label>
                  <span
                    className={`icon-left ${
                      errors.amount ? "border-red bg-red" : ""
                    }`}
                  >
                    £
                  </span>
                  <input
                    type="number"
                    placeholder=""
                    id="amount"
                    className={`w-full form-control pl-50 ${
                      errors.amount ? "border-red" : ""
                    }`}
                    {...register("amount", {
                      required: "This field is required",
                      pattern: { value: /\d*/g, message: "Must be numbers" },
                      maxLength: {
                        value: 10,
                        message: "Should be less than 10 characters long",
                      },
                      min: {
                        value: 1,
                        message: "Should be greater than zero",
                      },
                      onChange: (e) => handleOnChange(e),
                    })}
                  />
                  {errors.amount && (
                    <span className="error-text fs-14 mt-12">
                      {errors.amount.message}
                    </span>
                  )}
                </div>

                <div className="grid-col-2">
                  <div className="form-group ">
                    <label htmlFor="terms">Mortgage Terms</label>
                    <input
                      type="number"
                      placeholder=""
                      id="terms"
                      className={`w-full form-control pr-75 ${
                        errors.term ? "border-red" : ""
                      }`}
                      {...register("term", {
                        required: "This field is required",
                        pattern: { value: /\d*/g, message: "Must be numbers" },
                        maxLength: {
                          value: 10,
                          message: "Should be less than 10 characters long",
                        },
                        min: {
                          value: 1,
                          message: "Should be greater than zero",
                        },
                        onChange: (e) => handleOnChange(e),
                      })}
                    />
                    <span
                      className={`icon-right ${
                        errors.term ? "border-red bg-red" : ""
                      }`}
                    >
                      years
                    </span>
                    {errors.term && (
                      <span className="error-text fs-14 mt-12">
                        {errors.term.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="rate">Interest Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder=""
                      id="rate"
                      className={`w-full form-control pr-50 ${
                        errors.rate ? "border-red" : ""
                      }`}
                      {...register("rate", {
                        required: "This field is required",
                        pattern: { value: /\d*/g, message: "Must be numbers" },
                        maxLength: {
                          value: 10,
                          message: "Should be less than 10 characters long",
                        },
                        min: {
                          value: 1,
                          message: "Should be greater than zero",
                        },
                        onChange: (e) => handleOnChange(e),
                      })}
                    />
                    <span
                      className={`icon-right ${
                        errors.rate ? "border-red bg-red" : ""
                      }`}
                    >
                      %
                    </span>
                    {errors.rate && (
                      <span className="error-text fs-14 mt-12">
                        {errors.rate.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div>
                    <label>Query Type </label>
                  </div>
                  <div>
                    <div
                      className={`border inline height-51 ${
                        getValues("type") === RT.prePayment ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id="prepayment"
                        value={RT.prePayment}
                        {...register("type", {
                          required: "This field is required",
                          onChange: (e) => handleOnChange(e),
                        })}
                      />
                      <label
                        htmlFor="prepayment"
                        className="radio-label cursor-pointer"
                      >
                        Prepayment
                      </label>
                    </div>
                    <div
                      className={`mt-12 border inline height-51  ${
                        getValues("type") === RT.interestOnly ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id="interestOnly"
                        value={RT.interestOnly}
                        {...register("type", {
                          required: "This field is required",
                          onChange: (e) => handleOnChange(e),
                        })}
                      />
                      <label
                        htmlFor="interestOnly"
                        className="radio-label cursor-pointer"
                      >
                        Interest Only
                      </label>
                    </div>
                  </div>
                  {errors.type && (
                    <span className="error-text fs-14 mt-12">
                      {errors.type.message}
                    </span>
                  )}
                </div>
              </div>

              <button className="submit-btn" type="submit">
                <img src="images/icon-calculator.svg" alt="Calculator Icon" />
                Calculate Repayments
              </button>
            </form>
          </div>

          <div className="result">
            {!result.emi ? (
              <div className="banner">
                <img
                  src="images/illustration-empty.svg"
                  alt="illustration"
                  className="illustration"
                />
                <p className="text-bold">Results shown here</p>
                <p className="text-muted">
                  Complete the form and click “calculate repayments” to see what
                  your monthly repayments would be.
                </p>
              </div>
            ) : (
              <div className="calculation">
                <p className="text-bold">Your results</p>
                <p className="text-muted mt-16 ">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit the form and click
                  “calculate repayments” again.
                </p>
                <div className="details">
                  <div>
                    <p className="text-muted">Your monthly repayments</p>
                    <p className="text-large mt-8">£{result.emi}</p>
                  </div>
                  <div className="hr"></div>
                  <div>
                    <p>Total you'll repay over the term</p>
                    <p className="text-bold mt-8">£{result.total}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
