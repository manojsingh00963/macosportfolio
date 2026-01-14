import useWindowStore from '#store/window';

const WindowControls = ({ target }) => {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
  } = useWindowStore();

  return (
    <div id="window-controls">
      <div className="close z-10 w-4 h-4 cursor-pointer " onClick={() => closeWindow(target)} />
      <div className="minimize z-10 w-4 h-4 cursor-pointer " onClick={() => minimizeWindow(target)} />
      <div className="maximize z-10 w-4 h-4 cursor-pointer  " onClick={() => toggleMaximize(target)} />
    </div>
  );
};

export default WindowControls;
