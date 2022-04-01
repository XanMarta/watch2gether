import InputField from '../General/InputField'
import Button from '../General/Button'

function LoginUI(props) {
  const loginChange = props.loginChange;
  const loginHandler = props.loginHandler;
  return (
    <form class="w-full max-w-lg border-4 border-indigo-500/100">
      <InputField
        width={"full"}
        // InputMarginTop={0}
        // InputMarginBottom={2}
        InputPaddingLeft={2}
        InputPaddingRight={2}
        InputMarginBottom={6}
        name={"username"}
        type={"text"}
        placeholder={"username"}
        formMarginLeft={0}
        formMarginBottom={0.5}
        label={"Username"}
        onChange={loginChange}></InputField>
      <InputField
        width={"full"}
        // InputMarginTop={0}
        // InputMarginBottom={2}
        InputPaddingLeft={2}
        InputPaddingRight={2}
        InputMarginBottom={6}
        //height={"50"}
        name={"password"}
        type={"password"}
        placeholder={"password"}
        formMarginLeft={0}
        formMarginBottom={0.5}
        label={"Password"}
        onChange={loginChange}></InputField>
      <div className="mt-4">
        <Button size="lg" bgColor="black" textColor="white"
          onClick={(e) => { loginHandler(e) }}
          buttonName={"Login"}></Button>
      </div>
      <section class="mt-2 grid grid-cols-2 gap-x-40">
        <div>Forgot your password</div>
        <div>Register now</div>
      </section>
    </form>
  )
}

export default LoginUI