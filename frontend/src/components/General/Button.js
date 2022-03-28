import classnames from 'classnames';

function Button(props) {
  //const className = props.className;
  const bgColor = props.bgColor;
  const textColor = props.textColor;
  const size = props.size;
  const type = props.type;
  const onClick = props.onClick;
  const buttonName = props.buttonName
  return (
    <button className={classnames(`bg-${bgColor} text-${textColor} rounded`, {
      "text-xs": size === 'sm',
      "text-xl": size === 'lg',
    })}
      type={type}
      onClick={onClick}> {buttonName}</button>
  );
}
//bg-yellow-500

export default Button;