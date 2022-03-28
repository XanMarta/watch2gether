import InputField from "../General/InputField";
import Button from "../General/Button";

function ProfileForm() {
  return (
    <div className="">
      <h1>Profile page</h1>
      <div className="flex justify-center items-center">
        <div className="border-solid border-2 border-sky-500 w-full h-96">
          <div className="border-solid border-2 border-sky-500 w-40 h-40 ml-20 mt-20">
            Avatar
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Username:
            </label>
            <InputField
              width={"full"}
              height={"10"}
              name={"username"}
              type={"text"}
              placeholder={"username"}
            ></InputField>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default ProfileForm;