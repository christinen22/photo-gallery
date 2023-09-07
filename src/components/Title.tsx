import { NavLink } from "react-router-dom";

const Title = () => {
  return (
    <>
      <NavLink to="/login">Login</NavLink>
      <div className="title">
        <h1>ChrilliGram</h1>
        <h2>Pictures</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
      </div>
    </>
  );
};

export default Title;
