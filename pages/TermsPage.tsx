
import React from 'react';

const PageContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-dark p-8 sm:p-12 rounded-2xl space-y-6 text-light/80 leading-relaxed">
        {children}
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl font-bold text-light pt-4 font-heading">{children}</h2>
);


const TermsPage: React.FC = () => {
    return (
        <div className="bg-darker text-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-center mb-12">Términos y Condiciones de Uso</h1>
                    <PageContentWrapper>
                        <p className="text-light/60"><strong>Última actualización:</strong> 24 de Julio de 2024</p>
                        
                        <p>
                            Bienvenido a Smart Kids. Al acceder y utilizar este sitio web, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.
                        </p>

                        <SectionTitle>1. Aceptación de los Términos</SectionTitle>
                        <p>
                            El acceso y uso de esta plataforma implica tu total aceptación de los presentes Términos y Condiciones. Este proyecto es una iniciativa educativa sin fines de lucro.
                        </p>

                        <SectionTitle>2. Uso del Contenido</SectionTitle>
                        <p>
                            Todo el contenido de este sitio, incluyendo los podcasts, textos, gráficos y logotipos, es propiedad del proyecto educativo "Cerebros Brillantes" y sus participantes. El contenido está destinado únicamente para fines educativos y personales, no comerciales. Queda prohibida la reproducción, distribución o modificación del contenido sin autorización expresa.
                        </p>
                        
                        <SectionTitle>3. Conducta del Usuario</SectionTitle>
                        <p>
                            Como usuario, te comprometes a utilizar el sitio de manera respetuosa y con fines educativos. Cualquier uso indebido, como intentos de dañar la plataforma o la publicación de contenido inapropiado, resultará en la restricción del acceso.
                        </p>

                        <SectionTitle>4. Limitación de Responsabilidad</SectionTitle>
                        <p>
                           El contenido de Smart Kids se proporciona con fines educativos e informativos. No garantizamos la exactitud total de toda la información presentada, ya que es parte de un proceso de aprendizaje estudiantil. La institución educativa y los responsables del proyecto no se hacen responsables del uso que terceros puedan dar a la información aquí contenida.
                        </p>

                        <SectionTitle>5. Modificaciones a los Términos</SectionTitle>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento para reflejar la evolución del proyecto. Te recomendamos que revises esta página periódicamente para estar al tanto de los cambios.
                        </p>
                    </PageContentWrapper>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
