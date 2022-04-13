import classnames from 'classnames';

function Button(props) {
  //const className = props.className;
  const bgColor = props.bgColor;
  const textColor = props.textColor;
  const size = props.size;
  const type = props.type;
  const onClick = props.onClick;
  const buttonName = props.buttonName
  //bg-black hover:bg-gray-900 text-white text-center py-2 px-4 rounded
  return (
    <button className={classnames(`bg-${bgColor} hover:bg-gray-900 text-${textColor} text-center py-2 px-4 rounded`, {
      "text-xs": size === 'sm',
      "text-xl": size === 'lg',
    })}
      type={type}
      onClick={onClick}> {buttonName}</button>
  );
}
//bg-yellow-500

export default Button;