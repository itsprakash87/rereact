/** @jsx createElement */
import {createElement} from '@itsprakash87/rereact';
import './style.css';

export default ({ text, onClick, className }) => {
  return (
    <button className={className} onClick={() => onClick(text)}>{text}</button>
  );
}
