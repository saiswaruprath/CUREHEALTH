import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import "./upload.css";
import axios from "axios";

const Translation = () => {

    const [selectedLanguageFrom, setSelectedLanguageFrom] = useState('English');
    const [selectedLanguageTo, setSelectedLanguageTo] = useState('');
    const [translationText, setTranslationText] = useState('');

    const handleTranslationClick = async() => {
        try {
            let payload = {
                source: selectedLanguageFrom,
                target: selectedLanguageTo,
                text: translationText,
                type: 'translate_text'
            }

            let response = await axios.post("/translate", payload);
            if(response) console.log(response);

        } catch (error) {
            console.error("Error in the translation API:", error);
        }
    };

    const ALL_LANGUAGES_FULLFORM = [
        'Afrikaans', 'Amharic', 'Arabic', 'Armenian', 'Assamese', 'Azerbaijani', 'Basque', 'Belarusian', 'Bengali', 'Bosnian',
        'Bulgarian', 'Burmese', 'Cantonese', 'Catalan', 'Cebuano', 'Chichewa', 'Chin', 'Chinese (Mandarin)', 'Chinese (Mandarin, Traditional)', 'Croatian',
        'Czech', 'Danish', 'Dutch', 'Egyptian Arabic', 'English', 'Estonian', 'Finnish', 'French', 'Galician', 'Georgian',
        'German', 'Greek', 'Gujarati', 'Hebrew', 'Hindi', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish',
        'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khakas', 'Khmer', 'Korean', 'Kurdish (Sorani)', 'Kyrgyz',
        'Lao', 'Latvian', 'Lithuanian', 'Luganda', 'Luo', 'Macedonian', 'Maithili', 'Malay', 'Malayalam', 'Maltese',
        'Manipuri', 'Marathi', 'Moroccan Arabic', 'Nepali', 'Norwegian Bokmål', 'Norwegian Nynorsk', 'Odia', 'Polish', 'Portuguese', 'Punjabi',
        'Romanian', 'Russian', 'Serbian', 'Shona', 'Sindhi', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili',
        'Swedish', 'Tagalog', 'Tajik', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek',
        'Vietnamese', 'Welsh', 'West Central Oromo', 'Western Farsi', 'Yoruba', 'Zulu'
    ];    

    const LanguageDropdown = ({ languages, selectedLanguage, onSelectLanguage, excludeLanguage }) => {
        return (
            <div className="form-floating w-50">
                <select
                    className="form-select"
                    id={onSelectLanguage === setSelectedLanguageFrom ? "translate-from" : "translate-to"}
                    aria-label={onSelectLanguage === setSelectedLanguageFrom ? "Translate from" : "Translate to"}
                    value={selectedLanguage}
                    onChange={(e) => onSelectLanguage(e.target.value)}
                >
                    <option value="" hidden>Select an Option</option>
                    {languages.map((language, index) => (
                        <option value={language} key={index} hidden={excludeLanguage === language}>
                            {language}
                        </option>
                    ))}
                </select>
                <label htmlFor={onSelectLanguage === setSelectedLanguageFrom ? "translate-from" : "translate-to"} className="left--unset">
                    {onSelectLanguage === setSelectedLanguageFrom ? "Translate from" : "Translate to"}
                </label>
            </div>
        );
    };

    return <>
        <div className="search-section">
            <h2 className="text-center mb-4">Translation Module</h2>
            <div className="container mb-4">
                <div className="translation-page-header row">
                    <LanguageDropdown
                        languages={ALL_LANGUAGES_FULLFORM}
                        selectedLanguage={selectedLanguageFrom}
                        onSelectLanguage={setSelectedLanguageFrom}
                        excludeLanguage={selectedLanguageTo}
                    />
                    <LanguageDropdown
                        languages={ALL_LANGUAGES_FULLFORM}
                        selectedLanguage={selectedLanguageTo}
                        onSelectLanguage={setSelectedLanguageTo}
                        excludeLanguage={selectedLanguageFrom}
                    />                    
                </div>
                <div className="translation-page-header row">
                    <div className="form-floating col-12 my-3 w-50">
                        <textarea
                            className="min-height--150 form-control"
                            id="formGroupTranslateText"
                            placeholder="Enter Content Here"
                            name="content"
                            value={translationText}
                            onChange={(e) => setTranslationText(e.target.value)}
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
                            onChange={() => null}
                            disabled={true}
                        />
                        <label htmlFor="formGroupTranslateOutput" className="left--unset">
                            Translated Content:
                        </label>
                    </div>
                </div>
                <Button size="lg" variant="primary ms-auto" onClick={handleTranslationClick}>
                    Translate
                </Button>
            </div>
        </div>
    </>
}

export default Translation