import React from "react";
import { ButtonFile } from "../../styles";

const ButtonChooseFile = ({ data, isUpload, title, onChooseFile, setLoading }) => {
    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    Promise.resolve()
                        .then(() => onChooseFile(new Uint8Array(e.target.result)))
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject(e);
                        });
                };

                reader.onerror = function (e) {
                    return reject(e);
                };
            } catch (ex) {}
        });
    };
    const handleChoseFile = (e) => {
        var files = e.target.files;
        if (!files || !files[0] || !onChooseFile) {
            return;
        }
        if (setLoading) {
            setLoading(true);
        }
        readFile(files[0]).finally(() => {
            if (setLoading) {
                setLoading(false);
            }
        });
    };

    return (
        <ButtonFile>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <input
                    type="file"
                    multiple
                    accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => handleChoseFile(e)}
                />
                {title}
            </If>
        </ButtonFile>
    );
};

export default ButtonChooseFile;
