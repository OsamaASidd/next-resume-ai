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

const ResumePadding = () => {
  return (
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
};

export default function ResumeTemplate({ formData }: TResumeTemplateProps) {
  console.log('Template One Rendering with data:', formData);

  return (
    <Document>
      <Page size='A4' style={tw('flex flex-row flex-wrap')}>
        <ResumePadding />
        {/* Black section  */}
        <View
          style={tw(
            'flex-1 min-w-[30%] min-h-full p-5 pt-0 flex-col gap-2 text-white bg-black '
          )}
        >
          <Text style={tw('text-2xl font-bold')}>
            {formData.personal_details?.fname ?? 'First Name'}{' '}
            {formData.personal_details?.lname ?? 'Last Name'}
          </Text>
          <Text style={tw('text-sm')}>
            <i className='fas fa-envelope icon'></i>{' '}
            {formData.personal_details?.email ?? 'Email'}
          </Text>
          <Text style={tw('text-sm')}>
            <i className='fas fa-mobile-alt icon'></i>{' '}
            {formData.personal_details?.phone ?? 'Phone Number'}
          </Text>
          <Text style={tw('text-sm')}>
            <i className='fas fa-map-marker-alt icon'></i>
            {formData.personal_details?.city ?? 'City'},{' '}
            {formData.personal_details?.country ?? 'Country'}
          </Text>
          <Text style={tw('text-[#7f7f7f]')}>Skills</Text>
          <BulletedList
            items={
              formData?.skills?.map((skill) => ({
                name: `${skill.skill_name}`
              })) ?? []
            }
          />
          <Text style={tw('text-[#7f7f7f]')}>Tools</Text>
          <BulletedList
            items={
              formData?.tools?.map((tool) => ({
                name: `${tool.tool_name}`
              })) ?? []
            }
          />
          <Text style={tw('text-[#7f7f7f]')}>Languages</Text>
          <BulletedList
            items={
              formData?.languages?.map((lang) => ({
                name: `${lang.lang_name}`
              })) ?? []
            }
          />
        </View>
        {/* white section  */}
        <View style={tw('flex-1 min-w-[70%] p-5 pt-0 gap-4 flex-col bg-white')}>
          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>Summary</Text>
            <Text style={tw('text-sm')}>
              {formData.personal_details?.summary ?? 'Summary'}
            </Text>
          </View>

          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>Education</Text>
            <View style={tw('flex flex-col gap-6')}>
              {formData?.educations?.length &&
                formData?.educations?.map((edu, index) => (
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

          <View style={tw('flex flex-col')}>
            <Text style={tw('text-muted text-2xl font-bold')}>
              Employment History
            </Text>
            <View style={tw('flex flex-col gap-6')}>
              {formData?.jobs?.length &&
                formData?.jobs?.map((job, index) => (
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
        </View>
      </Page>
    </Document>
  );
}
