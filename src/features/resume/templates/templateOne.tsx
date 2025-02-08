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
  const hasSkills = formData?.skills?.length ?? 0 > 0;
  const hasTools = formData?.tools?.length ?? 0 > 0;
  const hasLanguages = formData?.languages?.length ?? 0 > 0;
  const hasEducation = formData?.education?.length ?? 0 > 0;
  const hasJobs = formData?.jobs?.length ?? 0 > 0;

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
            {formData?.personal_details?.fname ?? ''}{' '}
            {formData?.personal_details?.lname ?? ''}
          </Text>
          {formData?.personal_details?.email && (
            <Text style={tw('text-sm')}>
              <i className='fas fa-envelope icon'></i>{' '}
              {formData.personal_details.email}
            </Text>
          )}
          {formData?.personal_details?.phone && (
            <Text style={tw('text-sm')}>
              <i className='fas fa-mobile-alt icon'></i>{' '}
              {formData.personal_details.phone}
            </Text>
          )}
          {(formData?.personal_details?.city ||
            formData?.personal_details?.country) && (
            <Text style={tw('text-sm')}>
              <i className='fas fa-map-marker-alt icon'></i>
              {formData?.personal_details?.city}
              {formData?.personal_details?.city &&
                formData?.personal_details?.country &&
                ', '}
              {formData?.personal_details?.country}
            </Text>
          )}

          {hasSkills && (
            <>
              <Text style={tw('text-[#7f7f7f]')}>Skills</Text>
              <BulletedList
                items={
                  formData?.skills?.map((skill) => ({
                    name: skill.skill_name
                  })) ?? []
                }
              />
            </>
          )}

          {hasTools && (
            <>
              <Text style={tw('text-[#7f7f7f]')}>Tools</Text>
              <BulletedList
                items={
                  formData?.tools?.map((tool) => ({
                    name: tool.tool_name
                  })) ?? []
                }
              />
            </>
          )}

          {hasLanguages && (
            <>
              <Text style={tw('text-[#7f7f7f]')}>Languages</Text>
              <BulletedList
                items={
                  formData?.languages?.map((lang) => ({
                    name: lang.lang_name
                  })) ?? []
                }
              />
            </>
          )}
        </View>

        {/* white section  */}
        <View style={tw('flex-1 min-w-[70%] p-5 pt-0 gap-4 flex-col bg-white')}>
          {formData?.personal_details?.summary && (
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-muted text-2xl font-bold')}>Summary</Text>
              <Text style={tw('text-sm')}>
                {formData.personal_details.summary}
              </Text>
            </View>
          )}

          {hasEducation && (
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-muted text-2xl font-bold')}>Education</Text>
              <View style={tw('flex flex-col gap-6')}>
                {formData?.education?.map((edu, index) => (
                  <View key={index}>
                    <Text style={tw('font-bold text-lg')}>
                      {edu?.degree ?? ''} {edu?.field && `in ${edu.field}`}{' '}
                      {edu?.school && `| ${edu.school}`}
                    </Text>
                    {(edu?.start_date || edu?.end_date) && (
                      <Text style={tw('font-bold text-lg')}>
                        {edu?.start_date ?? ''} - {edu?.end_date ?? ''}
                      </Text>
                    )}
                    {edu?.description && (
                      <Text style={tw('text-sm')}>{edu.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {hasJobs && (
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-muted text-2xl font-bold')}>
                Employment History
              </Text>
              <View style={tw('flex flex-col gap-6')}>
                {formData?.jobs?.map((job, index) => (
                  <View wrap={false} key={index}>
                    <Text style={tw('font-bold text-lg')}>
                      {job?.job_title ?? ''}{' '}
                      {job?.employer && `| ${job.employer}`}
                    </Text>
                    {(job?.start_date || job?.end_date) && (
                      <Text style={tw('font-bold text-lg')}>
                        {job?.start_date ?? ''} - {job?.end_date ?? ''}
                      </Text>
                    )}
                    {job?.description && (
                      <Text style={tw('text-sm')}>{job.description}</Text>
                    )}
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
