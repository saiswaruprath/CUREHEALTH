import Button from 'react-bootstrap/Button';
import "./upload.css";

const Translation = () => {
    return <>
        <div className="search-section">
            <h2 className="text-center mb-4">Translation Module</h2>
            <div className="container mb-4">
                <div className="translation-page-header row">
                    <div className="form-floating w-50">
                        <select className="form-select" id="translate-from" aria-label="Translate from">
                            <option value="0" hidden>Select an Option</option>
                            <option value="en">English</option>
                            <option value="hw">Hawaiian</option>
                        </select>
                        <label htmlFor="translate-from" className="left--unset">Translate from</label>
                    </div>
                    <div className="form-floating w-50">
                        <select className="form-select" id="translate-to" aria-label="Translate to">
                        <   option value="0" hidden>Select an Option</option>
                            <option value="en">English</option>
                            <option value="hw">Hawaiian</option>
                        </select>
                        <label htmlFor="translate-to" className="left--unset">Translate to</label>
                    </div>
                </div>
                <div className="translation-page-header row">
                    <div className="form-floating col-12 my-3 w-50">
                        <textarea
                            className="min-height--150 form-control"
                            id="formGroupTranslateText"
                            placeholder="Enter Content Here"
                            name="content"
                            // value={resourceData.content}
                            onChange={() => null }
                        />
                        <label htmlFor="formGroupTranslateText" className="left--unset">
                            Enter the content you need to translate:
                        </label>
                    </div>

                    <div className="form-floating col-12 my-3 w-50">
                        <textarea
                            className="min-height--150 form-control"
                            id="formGroupTranslateOutput"
                            placeholder="Enter Content Here"
                            name="content"
                            // value={resourceData.content}
                            onChange={() => null }
                            disabled={true}
                        />
                        <label htmlFor="formGroupTranslateOutput" className="left--unset">
                            Translated Content:
                        </label>
                    </div>
                </div>
                <Button size="lg" variant="primary ms-auto" onClick={() => null }>
                    Translate
                </Button>
            </div>
        </div>
    </>
}

export default Translation