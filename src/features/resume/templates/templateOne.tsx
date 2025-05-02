import { TResumeEditFormValues } from '../utils/form-schema';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: 'cornflowerblue',
        h2: '#7f7f7f',
        muted: '#7f7f7f'
      }
    }
  }
});

type TResumeTemplateProps = {
  formData: TResumeEditFormValues;
};

type Item = {
  name: string;
};

const BulletedList = ({ items }: { items: Item[] }) => (
  <View>
    {items.map((item, index) => (
      <View
        style={tw('flex flex-row flex-wrap items-center gap-2')}
        key={index}
      >
        <Text>{'\u2022'}</Text>
        <Text style={tw('text-sm')}>{item.name}</Text>
      </View>
    ))}
  </View>
);

const ResumePadding = () => (
  <>
    <View
      fixed
      style={{
        height: 20,
        backgroundColor: 'black',
        width: '30%'
      }}
    />
    <View
      fixed
      style={{
        height: 20,
        width: '70%'
      }}
    />
  </>
);

export default function ResumeTemplate({ formData }: TResumeTemplateProps) {
  return (
    <Document>
      <Page size='A4' style={tw('flex flex-row flex-wrap')}>
        <ResumePadding />

        {/* Left (black) section */}
        <View
          style={tw(
            'flex-1 min-w-[30%] min-h-full p-5 pt-0 flex-col gap-2 text-white bg-black'
          )}
        >
          <Text style={tw('text-2xl font-bold')}>
            {formData.personal_details?.fname ?? 'First Name'}{' '}
            {formData.personal_details?.lname ?? 'Last Name'}
          </Text>
          <Text style={tw('text-sm')}>
            {formData.personal_details?.email ?? 'Email'}
          </Text>
          <Text style={tw('text-sm')}>
            {formData.personal_details?.phone ?? 'Phone Number'}
          </Text>
          <Text style={tw('text-sm')}>
            {formData.personal_details?.city ?? 'City'},{' '}
            {formData.personal_details?.country ?? 'Country'}
          </Text>

          <Text style={tw('text-muted')}>Skills</Text>
          <BulletedList
            items={
              formData?.skills?.map((skill) => ({
                name: `${skill.skill_name}`
              })) ?? []
            }
          />

          <Text style={tw('text-muted')}>Tools</Text>
          <BulletedList
            items={
              formData?.tools?.map((tool) => ({
                name: `${tool.tool_name}`
              })) ?? []
            }
          />

          <Text style={tw('text-muted')}>Languages</Text>
          <BulletedList
            items={
              formData?.languages?.map((lang) => ({
                name: `${lang.lang_name}`
              })) ?? []
            }
          />
        </View>

        {/* Right (white) section */}
        <View style={tw('flex-1 min-w-[70%] p-5 pt-0 gap-4 flex-col bg-white')}>
          {/* Summary */}
          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>Summary</Text>
            <Text style={tw('text-sm')}>
              {formData.personal_details?.summary ?? 'Summary'}
            </Text>
          </View>

          {/* Education */}
          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>Education</Text>
            <View style={tw('flex flex-col gap-6')}>
              {formData?.educations?.map((edu, index) => (
                <View key={index}>
                  <Text style={tw('font-bold text-lg')}>
                    {edu?.degree ?? 'Degree'} in {edu?.field ?? 'Field'} |{' '}
                    {edu?.school ?? 'School'}
                  </Text>
                  <Text style={tw('font-bold text-lg')}>
                    {edu?.startDate ?? 'Start Date'} -{' '}
                    {edu?.endDate ?? 'End Date'}
                  </Text>
                  <Text style={tw('text-sm')}>{edu?.description ?? ''}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Employment History */}
          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>
              Employment History
            </Text>
            <View style={tw('flex flex-col gap-6')}>
              {formData?.jobs?.map((job, index) => (
                <View wrap={false} key={index}>
                  <Text style={tw('font-bold text-lg')}>
                    {job?.jobTitle ?? 'Job Title'} |{' '}
                    {job?.employer ?? 'Employer'}
                  </Text>
                  <Text style={tw('font-bold text-lg')}>
                    {job?.startDate ?? 'Start Date'} -{' '}
                    {job?.endDate ?? 'End Date'}
                  </Text>
                  <Text style={tw('text-sm')}>{job?.description ?? ''}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Certificates */}
          {formData?.certificates?.length > 0 && (
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-muted text-2xl font-bold')}>
                Certifications
              </Text>
              <View style={tw('flex flex-col gap-6')}>
                {formData.certificates.map((cert, index) => (
                  <View key={index}>
                    <Text style={tw('font-bold text-lg')}>
                      {cert?.name ?? 'Certificate'} | {cert?.issuer ?? 'Issuer'}
                    </Text>
                    <Text style={tw('font-bold text-lg')}>
                      {cert?.issueDate ?? 'Issue Date'}
                    </Text>
                    <Text style={tw('text-sm')}>{cert?.description ?? ''}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Extracurricular Activities */}
          {formData?.extracurriculars?.length > 0 && (
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-muted text-2xl font-bold')}>
                Extracurricular Activities
              </Text>
              <View style={tw('flex flex-col gap-6')}>
                {formData.extracurriculars.map((eca, index) => (
                  <View key={index}>
                    <Text style={tw('font-bold text-lg')}>
                      {eca?.activityName ?? 'Activity'} |{' '}
                      {eca?.organization ?? 'Organization'}
                    </Text>
                    <Text style={tw('font-bold text-lg')}>
                      {eca?.startDate ?? 'Start Date'} -{' '}
                      {eca?.endDate ?? 'End Date'}
                    </Text>
                    <Text style={tw('text-sm')}>{eca?.description ?? ''}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
