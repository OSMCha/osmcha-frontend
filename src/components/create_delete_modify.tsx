export function CreateDeleteModify(props: any) {
  const showZero = props.showZero;
  return (
    <div
      className={`flex-parent flex-parent--row flex-parent--wrap ${props.className}`}
    >
      {(props.create > -1 || showZero) && (
        <div className="cmap-bg-create  color-white inline-block px6 txt-s txt-bold round unround-r">
          {props.create}
        </div>
      )}
      {(props.modify > -1 || showZero) && (
        <div className="cmap-bg-modify-old  color-white inline-block px6  txt-s txt-bold unround">
          {props.modify}
        </div>
      )}
      {(props.delete > -1 || showZero) && (
        <div className="cmap-bg-delete color-white inline-block px6 txt-s txt-bold round unround-l">
          {props.delete}
        </div>
      )}
    </div>
  );
}

// export function CreateDeleteModify(props: Object) {
//   const showZero = props.showZero;
//   return (
//     <div
//       className={`flex-parent flex-parent--row ${props.className} border border--gray-light border--1 round`}
//     >
//       <span className="mr6 flex-parent align-items--center">
//         <svg className="icon inline-block align-middle">
//           <use xlinkHref="#icon-plus-document" />
//         </svg>
//         <span className="color-gray txt-bold ">{props.create}</span>
//       </span>
//       <span className="mr6 cmap-bg-modify-old flex-parent align-items--center">
//         <span className="color-white txt-bold ">{props.modify}</span>
//       </span>
//       <span className="mr6 flex-parent align-items--center">
//         <svg className="icon inline-block align-middle ">
//           <use xlinkHref="#icon-trash" />
//         </svg>
//         <span className="color-gray txt-bold ">{props.delete}</span>
//       </span>
//     </div>
//   );
// }
