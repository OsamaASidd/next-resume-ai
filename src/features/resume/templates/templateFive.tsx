import { TResumeEditFormValues } from '../utils/form-schema';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

const tw = createTw({
  theme: {
    extend: {
      colors: {
        europassBlue: '#004c80',
        europassLightBlue: '#2563eb',
        europassAccent: '#5897bf',
        textGray: '#374151',
        lightGray: '#6b7280'
      }
    }
  }
});

type TResumeTemplateProps = {
  formData: TResumeEditFormValues;
};

// Europass logo/branding component
// Updated Europass logo/branding component
const EuropassHeader = () => (
  <View style={tw('flex flex-row justify-between items-center mb-4')}>
    {/* Empty left side for spacing */}
    <View style={tw('flex-1')} />

    {/* Right side with EU flag and europass text */}
    <View style={tw('flex flex-row items-center gap-3')}>
      {/* EU Flag */}

      <Image
        src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png'
        style={tw('w-[45px] h-[30px] border')}
      />

      {/* Europass text */}
      <Text style={tw('text-white text-3xl font-normal leading-none me-4')}>
        europass
      </Text>
    </View>
  </View>
);

// Updated contact header with proper wrapping
const ContactHeader = ({ formData }: { formData: TResumeEditFormValues }) => (
  <View style={tw('bg-europassBlue px-6 py-4')}>
    <EuropassHeader />

    {/* Contact Information */}
    <View style={tw('flex flex-col gap-1')}>
      <View style={tw('flex flex-row items-center gap-1')}>
        <Text style={tw('text-white text-3xl font-bold leading-none')}>
          {formData.personal_details?.fname ?? 'First Name'}{' '}
          {formData.personal_details?.lname ?? 'Last Name'}
        </Text>
      </View>
      <View style={tw('h-0.5 bg-europassAccent w-full my-2')} />
      <View style={tw('flex flex-row items-center gap-1 flex-wrap')}>
        {formData.personal_details?.phone && (
          <>
            <Text style={tw('text-white text-sm font-semibold')}>
              Phone number:
            </Text>
            <Text style={tw('text-white text-sm')}>
              {formData.personal_details?.phone ?? ''} (Mobile)
            </Text>
          </>
        )}
        {formData.personal_details?.email && (
          <>
            <Text style={tw('text-lightGray text-sm mx-2')}>|</Text>
            <Text style={tw('text-white text-sm font-semibold')}>
              Email address:
            </Text>
            <Text style={tw('text-white text-sm')}>
              {formData.personal_details?.email ?? ''}
            </Text>
          </>
        )}

        {formData.personal_details?.city && (
          <>
            <Text style={tw('text-lightGray text-sm mx-2')}>|</Text>
            <Text style={tw('text-white text-sm font-semibold')}>Address:</Text>
            <Text style={tw('text-white text-sm')}>
              {formData.personal_details?.city ?? 'City'},{' '}
              {formData.personal_details?.country ?? 'Country'} (Home)
            </Text>
          </>
        )}
      </View>
    </View>
  </View>
);

// Section header with blue circle bullet
const SectionHeader = ({ title }: { title: string }) => (
  <View style={tw('flex flex-row items-center gap-2 mb-3 ')}>
    <View style={tw('w-2 h-2 bg-europassAccent rounded-full')} />
    <View style={tw('flex-1')}>
      <Text
        style={tw('text-black font-bold text-lg uppercase leading-none mb-1')}
      >
        {title}
      </Text>
      <View style={tw('h-[2px] bg-europassAccent w-full')} />
    </View>
  </View>
);

// Bullet point list component
const BulletList = ({ items }: { items: string[] }) => (
  <View style={tw('ml-4')}>
    {items.map((item, index) => (
      <View
        key={index}
        style={tw('leading-none flex flex-row items-start gap-2')}
      >
        <Text style={tw(' text-sm mt-1')}>•</Text>
        <Text style={tw(' text-sm flex-1')}>{item}</Text>
      </View>
    ))}
  </View>
);

function formatDate(input: string): string {
  const [year, month, day] = input.split('-');
  return `${day}/${month}/${year}`;
}

export default function EuropassTemplate({ formData }: TResumeTemplateProps) {
  console.log('Europass Template Rendering with data:', formData);

  return (
    <Document>
      <Page size='A4'>
        <ContactHeader formData={formData} />

        <View style={tw('p-6')}>
          {/* About Me Section */}
          <SectionHeader title='About Me' />
          <Text style={tw('ml-4 mb-4  text-sm  leading-relaxed')}>
            {formData.personal_details?.summary ??
              'Professional summary describing experience, skills, and career objectives. This section provides an overview of qualifications and achievements relevant to the position being sought.'}
          </Text>
          {/* Work Experience Section */}
          {formData?.jobs?.length && <SectionHeader title='Work Experience' />}
          <View style={tw('ml-4 mb-2')}>
            {formData?.jobs?.length
              ? formData.jobs.map((job, index) => (
                  <View key={index} style={tw('mb-4')} wrap={false}>
                    {/* Company name and location */}
                    <View
                      style={tw(
                        'flex flex-row items-center text-base uppercase leading-none mb-2'
                      )}
                    >
                      <Text style={tw('font-bold text-textGray ')}>
                        {job?.employer ?? 'Company Name'}{' '}
                      </Text>
                      <Text style={tw('font-light text-textGray ')}>
                        – {job?.city ?? 'City'}
                      </Text>
                    </View>

                    {/* Job title and dates */}
                    <View style={tw('mb-2')}>
                      <View
                        style={tw(
                          'flex flex-row items-center text-base leading-none mb-1 uppercase'
                        )}
                      >
                        <Text style={tw('font-bold text-textGray ')}>
                          {job?.jobTitle ?? 'Job Title'}{' '}
                        </Text>
                        {job?.startDate && job?.endDate && (
                          <Text style={tw('font-light text-textGray ')}>
                            – {formatDate(job?.startDate ?? 'Start Date')} –{' '}
                            {formatDate(job?.endDate ?? 'End Date')}
                          </Text>
                        )}
                      </View>
                      {/* Shortened line that only covers the content above */}
                      <View
                        style={tw(
                          'h-[0.75px] bg-europassAccent place-self-start'
                        )}
                      />
                    </View>

                    {/* Job description as bullet points */}
                    {job?.description && (
                      <BulletList
                        items={job.description
                          .split('\n')
                          .filter((item) => item.trim())}
                      />
                    )}
                  </View>
                ))
              : ''}
          </View>
          {/* Education and Training Section */}
          <SectionHeader title='Education and Training' />
          <View style={tw('ml-4 mb-2')}>
            {formData?.educations?.length
              ? formData.educations.map((edu, index) => (
                  <View key={index} style={tw('mb-2')} wrap={false}>
                    {/* Date range and location */}
                    <View
                      style={tw(
                        'flex flex-row items-center text-sm leading-none mb-1 mt-1'
                      )}
                    >
                      {edu?.startDate && edu?.endDate && (
                        <Text style={tw('text-textGray')}>
                          {formatDate(edu?.startDate ?? 'Start Date')} –{' '}
                          {formatDate(edu?.endDate ?? 'End Date')}{' '}
                          {edu?.city ?? 'City'}
                        </Text>
                      )}
                    </View>

                    {/* Degree and institution */}
                    <View style={tw('mb-2')}>
                      <View style={tw('flex flex-row items-center flex-wrap')}>
                        <Text
                          style={tw(
                            'font-bold text-textGray text-base uppercase leading-none'
                          )}
                        >
                          {edu?.degree ?? ''} IN {edu?.field ?? ' '}{' '}
                        </Text>
                        <Text
                          style={tw(
                            'font-light text-textGray  text-base capitalize leading-none'
                          )}
                        >
                          {edu?.school ?? ' '}
                        </Text>
                      </View>
                      {/* Blue accent line */}
                      <View style={tw('h-px bg-europassAccent w-full mt-1')} />
                    </View>

                    {/* Additional details if available */}
                    {edu?.description && (
                      <Text style={tw('text-sm leading-relaxed')}>
                        {edu.description}
                      </Text>
                    )}
                  </View>
                ))
              : ''}
          </View>
          {/* Language Skills Section */}
          {formData?.languages?.length ? (
            <>
              <SectionHeader title='Language Skills' />
              <View style={tw('ml-4 mb-2')}>
                <Text style={tw(' text-sm mb-2')}>
                  Mother tongue(s):{' '}
                  <Text style={tw(' font-bold')}>
                    {formData.languages
                      .map((lang) => lang.lang_name?.toUpperCase())
                      .join(', ')}
                  </Text>
                </Text>
              </View>
            </>
          ) : (
            ''
          )}
          {/* Skills Section */}
          {(formData?.skills?.length || formData.tools?.length) && (
            <>
              <SectionHeader title='Skills' />
              <View style={tw('ml-4 flex ')}>
                {formData?.skills?.length && (
                  <Text style={tw('text-sm leading-relaxed')}>
                    {formData.skills
                      .map((skill) => skill.skill_name)
                      .join('  |  ')}
                  </Text>
                )}{' '}
                {/* {formData?.tools?.length && (
                  <Text style={tw('text-sm leading-none')}>
                    {' | '}
                    {formData.tools.map((tool) => tool.tool_name).join(' | ')}
                  </Text>
                )} */}
              </View>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
