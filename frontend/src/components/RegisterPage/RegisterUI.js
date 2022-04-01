import InputField from '../General/InputField'
import Button from '../General/Button'

function RegisterUI(props) {
  const registerChange = props.registerChange;
  const registerHandler = props.registerHandler;
  return (
    <>
      <div className="mt-5 my-28 flex justify-center items-center border-4 border-indigo-500/100">
        <form class="w-full max-w-lg border-4 border-indigo-500/100">
          <InputField
            width={"full"}
            // InputMarginTop={0}
            // InputMarginBottom={2}
            InputPaddingLeft={3}
            InputPaddingRight={2}
            InputMarginBottom={6}
            name={"email"}
            type={"text"}
            placeholder={"email"}
            formMarginLeft={0}
            formMarginBottom={0.5}
            label={"Email"}
            onChange={registerChange}></InputField>
          <InputField
            width={"full"}
            // InputMarginTop={0}
            // InputMarginBottom={2}
            InputPaddingLeft={2}
            InputPaddingRight={2}
            InputMarginBottom={6}
            name={"phone"}
            type={"text"}
            placeholder={"phoneNumber"}
            formMarginLeft={0}
            formMarginBottom={0.5}
            label={"Phone Number"}
            onChange={registerChange}></InputField>
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
            onChange={registerChange}></InputField>
          <InputField
            width={"full"}
            // InputMarginTop={0}
            // InputMarginBottom={10}
            InputPaddingLeft={2}
            InputPaddingRight={2}
            InputMarginBottom={6}
            name={"password"}
            type={"password"}
            placeholder={"Enter your password here"}
            formMarginLeft={0}
            formMarginBottom={0.5}
            label={"Password"}
            onChange={registerChange}></InputField>
          <section className="mt-4">
            <Button size="lg" textColor="white" bgColor="black"
              onClick={(e) => { registerHandler(e) }}
              buttonName={"Register"}></Button>
          </section>
          <div class="mt-5 flex justify-center items-center">
            <p>Login now</p>
          </div>

        </form>
      </div>
    </>
  )
}

export default RegisterUI