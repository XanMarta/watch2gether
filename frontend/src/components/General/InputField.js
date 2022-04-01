import classnames from 'classnames';

function InputField(props) {
  //for input
  const width = props.width;
  const height = props.height;
  const name = props.name;
  const type = props.type;
  const placeholder = props.placeholder;
  const onChange = props.onChange;
  const defaultValue = props.defaultValue;
  const InputPaddingLeft = props.InputPaddingLeft;
  const InputPaddingRight = props.InputPaddingRight;
  const InputMarginBottom = props.InputMarginBottom;
  //for label
  const label = props.label;
  //form
  const formMarginLeft = props.marginLeft;
  const formMarginBottom = props.labelMarginBottom;
  return (
    //w-full mt-2 mb-6 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500
    <div className={classnames(`flex flex-wrap -mx-${formMarginLeft} mb-${formMarginBottom} border-4 border-indigo-500/100`)}>
      <label class="font-bold mb-2">
        {label}
      </label>
      {/* </div> */}
      <input
        className={classnames(`w-${width} 
      h-${height} px-${InputPaddingLeft} py-${InputPaddingRight} mb-${InputMarginBottom} border rounded-lg focus:shadow-outline`)}
        name={name} type={type} placeholder={placeholder} onChange={onChange} defaultValue={defaultValue} />
    </div>
  );
}

export default InputField;