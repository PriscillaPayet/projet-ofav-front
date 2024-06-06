import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ICategory, ICollection } from '../../@types/interface';
import Spinner from '../Spinner/Spinner';
import RessourceURL from '../Ressources/RessourceURL';
import RessourceText from '../Ressources/RessourceText';

function EditCollection() {
  // State variables
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [content, setContent] = useState('');
  const [ressource, setRessource] = useState<
    { metadata: any; content: string; type: number }[]
  >([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [authorId, setAuthorId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ICategory[]>([]);
  const [published, setPublished] = useState('0');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [singleCollectionData, setSingleCollectionData] =
    useState<ICollection>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageBlob, setSelectedImageBlob] = useState<
    File | undefined
  >();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    ''
  );
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  // const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  // useEffect to update title and description when singleCollectionData changes
  useEffect(() => {
    if (singleCollectionData) {
      setTitle(singleCollectionData.title);
      setDescription(singleCollectionData.description);
    }
  }, [singleCollectionData]);

  // handle input changes
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageBlob(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  // visually add resource (URL or plain text) to the collection
  const addRessource = async () => {
    if (content.trim() !== '') {
      // check if the content is a URL or plain text
      const isUrl = content.match(/^(https?:\/\/|www\.)\S+/i);

      if (isUrl) {
        try {
          const result = await axios.get(
            `https://jsonlink.io/api/extract?url=${content}`
          );
          const updatedMetadata = result.data;

          setRessource([
            ...ressource,
            { metadata: updatedMetadata, type: 0, content },
          ]);

          setContent('');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('An error occurred while fetching metadata:', error);
        }
      } else {
        // it's plain text, add as a resource without fetching metadata
        setRessource([...ressource, { metadata: null, type: 1, content }]);
        setContent('');
      }
    }
  };

  // Handle Enter key press for adding resource
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addRessource();
    }
  };

  const id = sessionStorage.getItem('id');

  // fetch the collection data for editing
  const fetchSingleCollection = useCallback(async () => {
    try {
      const result = await axios.get(
        `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${collectionId}`
      );
      setAuthorId(result.data.user.id);
      setSingleCollectionData(result.data);
      // convert the fetched "published" value to a string for setting the selected value in the dropdown select input.
      setPublished(result.data.published.toString());
      setSelectedCategoryId(result.data.category.id);
      setIsLoading(false);
      setSelectedImage(result.data.picture);
      setIsDataLoaded(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while fetching the collection:', error);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchSingleCollection();
  }, [fetchSingleCollection]);

  // function to visually delete a newly added resource
  const handleDeleteResource = (index: number) => {
    const updatedResources = [...ressource];
    updatedResources.splice(index, 1);
    setRessource(updatedResources);
  };

  const handleDeleteSavedResource = (index: number) => {
    if (singleCollectionData && singleCollectionData.ressource) {
      const updatedSavedResources = [...singleCollectionData.ressource];
      updatedSavedResources.splice(index, 1);

      // filter out the deleted resource from the existing resources
      const updatedRessource = ressource.filter((_, idx) => idx !== index);
      setRessource(updatedRessource);

      setSingleCollectionData({
        ...singleCollectionData,
        ressource: updatedSavedResources,
      });
    }
  };

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const authToken = sessionStorage.getItem('authToken');

    if (authToken) {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };

      try {
        // Merge the existing resources with the new resources
        const mergedResources = [
          ...ressource,
          ...(singleCollectionData?.ressource || []),
        ];

        // Convert the image to base64 string only if a new image is selected
        let base64Image = '';
        if (selectedImage && selectedImageBlob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            base64Image = event.target?.result as string;
            // Send the image data and other form data to the backend
            const formData = {
              title,
              description,
              published,
              category: selectedCategoryId,
              ressource: mergedResources,
              user: id,
              picture: base64Image,
            };
            axios
              .post(
                `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${collectionId}/update`,
                formData,
                config
              )
              .then(() => {
                navigate('/mes-collections');
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error:', error);
              });
          };
          reader.readAsDataURL(selectedImageBlob);
        } else {
          // If no new image is selected, send the other form data with the existing "picture" value
          const formData = {
            title,
            description,
            published,
            category: selectedCategoryId,
            ressource: mergedResources,
            user: id,
            picture: singleCollectionData?.picture,
          };
          axios
            .post(
              `http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/${collectionId}/update`,
              formData,
              config
            )
            .then(() => {
              navigate('/mes-collections');
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('Error:', error);
            });
        }
      } catch (error: any) {
        if (error.response) {
          // eslint-disable-next-line no-console
          console.error('Server error:', error.response.data);
        } else {
          // eslint-disable-next-line no-console
          console.error('Request error:', error.message);
        }
      }
    }
  };

  // fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await axios.get(
          'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/category/all'
        );
        const categoriesArray = result.data.categories;
        setCategory(categoriesArray);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "Une erreur s'est produite lors de la récupération des collections:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // find the selected category based on its ID
    const categoryFound = category.find((cat) => cat.id === selectedCategoryId);

    // update the selectedCategory state with the found category, or set it to null if not found
    setSelectedCategory(categoryFound || null);
  }, [selectedCategoryId, category]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // convert the selected cat ID from a string into an integer (base 10), which is the expected data type for selectedCategoryId.
    setSelectedCategoryId(parseInt(event.target.value, 10));
  };

  // Render loading state
  if (isLoading) {
    return <Spinner />;
  }
  // eslint-disable-next-line eqeqeq
  if (authorId == id) {
    return (
      <div>
        <h1 className="text-center text-3xl font-bold my-4">
          Modifier ma Collection
        </h1>
        <div className="w-11/12 p-1 my-7 pb-3 shadow-2xl mx-auto flex flex-col md:grid md:grid-cols-3 md:gap-4">
          <div className="w-full md:w-2/3 mx-auto md:col-span-1">
            <section className="my-5 mb-2 mx-auto md:max-w-md">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                Vous souhaitez que votre collection soit:
              </label>
              <select
                value={published}
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 mb-5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
                onChange={(event) => setPublished(event.target.value)}
              >
                <option id="1" value="0">
                  Privée
                </option>
                <option id="2" value="1">
                  Publique
                </option>
              </select>
            </section>
            <section className="mb-2 mx-auto md:max-w-md">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                Catégorie:
              </label>
              <select
                value={selectedCategory?.id || ''}
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 mb-5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
                onChange={handleCategoryChange}
              >
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </section>
            <section className="mb-3">
              <div className="mx-auto mb-7 max-w-md">
                <label
                  htmlFor="example1"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Modifiez la photo de la collection
                </label>
                <input
                  id="picture"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="text-gray-700 mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-cyan-700 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
                  onChange={handleImageChange}
                />
              </div>
            </section>
            <section className="md:max-w-md mx-auto mb-2">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                Titre:
              </label>
              <input
                className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
                type="text"
                placeholder={singleCollectionData?.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </section>
            <section className="mb-8 md:max-w-md mx-auto">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                Description:
              </label>
              <textarea
                className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
                rows={3}
                maxLength={500}
                placeholder={singleCollectionData?.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>
            <button
              type="submit"
              className="rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-cyan-700"
              onClick={handleEdit}
            >
              Valider la modification
            </button>
          </div>
          <div className="w-full mx-auto md:col-span-2">
            <img
              src={singleCollectionData?.picture}
              alt="couverture de la collection"
              className="rounded-xl w-full object-cover h-64 w-banner mx-auto mb-8 max-w-xl"
            />
            <div className="flex items-center mx-auto mb-5 w-full justify-between md:max-w-2xl">
              <input
                type="text"
                placeholder="URL du lien ou texte"
                value={content}
                className="my-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm flex-grow"
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                onClick={addRessource}
                className="rounded-full p-1 bg-cyan-700 text-white mx-1 px-1"
              >
                <svg
                  width="31px"
                  height="31px"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#ffffff"
                >
                  <path
                    d="M8 12h4m4 0h-4m0 0V8m0 4v4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* List of newly added resources */}
            {ressource.map((item, index) => (
              <div key={index}>
                {item.metadata ? (
                  <RessourceURL
                    url={item.metadata.url}
                    images={item.metadata.images}
                    title={item.metadata.title}
                    description={item.metadata.description}
                    onDelete={() => handleDeleteResource(index)}
                  />
                ) : (
                  <RessourceText
                    text={item.content}
                    onDelete={() => handleDeleteResource(index)}
                  />
                )}
              </div>
            ))}
            {/* List of resources already saved in the database */}
            {singleCollectionData?.ressource.map((item, index) =>
              item.type === 0 ? (
                <RessourceURL
                  key={index}
                  url={item.url}
                  images={item.images}
                  title={item.title}
                  description={item.description}
                  onDelete={() => handleDeleteSavedResource(index)}
                />
              ) : (
                <RessourceText
                  key={index}
                  text={item.content}
                  onDelete={() => handleDeleteSavedResource(index)}
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl my-2">Oups...</h1>
      <p className="text-center my-2">
        Vous ne disposez pas des droits pour modifier cette collection
      </p>
      <Link
        className="block w-full px-4 py-3 text-sm text-cyan-700 hover:bg-gray-100 text-center font-bold my-2"
        to="/mes-collections"
      >
        Revenir à mes collections
      </Link>
    </div>
  );
}

export default EditCollection;
