import React from "react";
import Modal from "react-responsive-modal";
import ButtonStyled from "../buttonStyled";
import { MainViewContext } from "../../context/mainViewProvider";

export default function PreviewDisplay({
  task,
  updateAvailableTasks,
  updateMyTasks,
  buttons,
  openTask,
  setOpenTask,
  previewTask,
}) {
  const { setView } = React.useContext(MainViewContext);

  function assignTask(user) {
    Meteor.call("assign_task_to", { userId: user == "me" ? -1 : "" });

    //actualizar tareas
    setOpenTask(false);
    updateAvailableTasks(Math.random());
    updateMyTasks(Math.random());
  }

  return (
    <Modal
      open={openTask}
      onClose={() => setOpenTask(false)}
      center
      showCloseIcon={false}
      classNames={{
        overlay: "previewOverlay",
        modal: "previewModal",
      }}
    >
      <div className="preview-container">
        <header>
          <h1 className="request-title">{task.displayName}</h1>
        </header>
        {previewTask}
        <footer className="request-buttons">
          <ButtonStyled onClick={() => setOpenTask(false)} icon="/close.svg">
            Cerrar
          </ButtonStyled>
          {buttons.abandon && (
            <ButtonStyled onClick={() => assignTask('none')} icon="/erase.svg">
              Abandonar
            </ButtonStyled>
          )}
          {buttons.accept && (
            <ButtonStyled onClick={() => assignTask('me')} icon="/accept.svg">
              tomar tarea
            </ButtonStyled>
          )}
          {buttons.procced && (
            <ButtonStyled
              onClick={() => setView(task.name, { taskId: task.id })}
              icon="/quill.svg"
            >
              tomar tarea
            </ButtonStyled>
          )}
        </footer>
      </div>
    </Modal>
  );
}
