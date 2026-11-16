document.addEventListener('DOMContentLoaded', () => {
    function initAddPhoto(root = document) {
        const cleanups = [];

        root.querySelectorAll('.form-add-photo').forEach((block) => {
            const input = block.querySelector('input[type="file"]');
            const preview = block.querySelector('.form-add-photo__item-img');
            const removeButton = block.querySelector('.form-add-photo__item-remove');
            const error = block.querySelector('.form-add-photo__error');

            if (!input || !preview || !removeButton || !error) return;

            const maxSize = 3 * 1024 * 1024;
            const allowedTypes = ['image/jpeg', 'image/png'];
            let previewUrl = null;

            error.setAttribute('role', 'alert');
            removeButton.setAttribute('aria-label', 'Удалить фотографию');

            function setError(message = '') {
                error.textContent = message;
                block.classList.toggle('is-error', Boolean(message));

                if (message) {
                    input.setAttribute('aria-invalid', 'true');
                } else {
                    input.removeAttribute('aria-invalid');
                }
            }

            function clearPhoto() {
                block.classList.remove('is-file');
                preview.removeAttribute('src');
                input.value = '';

                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
            }

            function onChange() {
                const file = input.files?.[0];

                if (!file) return;

                setError();

                const validExtension = /\.(jpe?g|png)$/i.test(file.name);
                const validType = !file.type || allowedTypes.includes(file.type);

                if (!validExtension || !validType) {
                    clearPhoto();
                    setError('Загрузите фотографию в формате JPG, JPEG или PNG.');
                    return;
                }

                if (file.size > maxSize) {
                    clearPhoto();
                    setError('Размер фотографии не должен превышать 3 Мб.');
                    return;
                }

                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }

                previewUrl = URL.createObjectURL(file);
                preview.src = previewUrl;
                block.classList.add('is-file');
            }

            function onRemove() {
                clearPhoto();
                setError();
                input.focus();
            }

            function onPreviewError() {
                if (!previewUrl) return;

                clearPhoto();
                setError('Не удалось открыть фотографию. Выберите другой файл.');
            }

            function onReset() {
                clearPhoto();
                setError();
            }

            const form = input.form;

            input.addEventListener('change', onChange);
            removeButton.addEventListener('click', onRemove);
            preview.addEventListener('error', onPreviewError);
            form?.addEventListener('reset', onReset);

            cleanups.push(() => {
                input.removeEventListener('change', onChange);
                removeButton.removeEventListener('click', onRemove);
                preview.removeEventListener('error', onPreviewError);
                form?.removeEventListener('reset', onReset);
                clearPhoto();
                setError();
            });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
    }

    initAddPhoto();

    function initAuthorsPublicationFields() {
        const maxInputs = 4;

        document.querySelectorAll('.js-authors-publications-form-group').forEach((group) => {
            const list = group.querySelector('.authors-publications__form-group-list');
            const addButton = group.querySelector('.js-authors-publications-form-group-btn');
            const template = list.querySelector('.authors-publications__form-group-item').cloneNode(true);

            const getInputsCount = () =>
                list.querySelectorAll('.js-authors-publications-form-group-input').length;

            const updateButton = () => {
                addButton.disabled = getInputsCount() >= maxInputs;
            };

            addButton.addEventListener('click', () => {
                if (getInputsCount() >= maxInputs) return;

                const item = template.cloneNode(true);
                const input = item.querySelector('.js-authors-publications-form-group-input');
                const error = item.querySelector('.form-error');

                input.value = '';
                if (error) error.textContent = '';

                list.append(item);
                updateButton();
                input.focus();
            });

            updateButton();
        });
    }

    initAuthorsPublicationFields()
})