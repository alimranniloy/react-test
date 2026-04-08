import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

type PopupProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
};

export default function Popup({
  title = "Item preview",
  open,
  onClose,
  children,
  panelClassName = "",
}: PopupProps) {
  return (
    <Transition.Root as={Fragment} show={open}>
      <Dialog as="div" className="relative z-[99]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`h-[90vh] relative transform overflow-auto rounded-lg bg-white px-4 pt-2 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-4 ${panelClassName}`}
              >
                <div className="pb-3 mb-3 border-b-2 flex justify-between items-center">
                  <h1 className="text-gray-700 font-bold">{title}</h1>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
